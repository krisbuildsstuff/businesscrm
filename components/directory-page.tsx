'use client'

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Mail, ExternalLink } from "lucide-react"
import Link from "next/link"

type Tool = {
  name: string;
  website: string;
  description: string;
  logo: string;
  categories: string[];
  email: string;
  published: boolean;
  slug: string;
};

export default function DirectoryPageComponent() {
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);

  const categories = ["Sales", "Marketing", "Support", "HR"];

  useEffect(() => {
    async function fetchTools() {
      try {
        const response = await fetch('/api/getTools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        setTools(data);
        setFilteredTools(data);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    }

    fetchTools();
  }, []);

  const handleCategoryFilter = (category: string | null) => {
    if (category) {
      setFilteredTools(tools.filter(tool => tool.categories.includes(category)));
    } else {
      setFilteredTools(tools);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-2 text-center">
        <a href="https://teamopipe.com" target="_blank" rel="noopener noreferrer" className="hover:underline">
          <span className="text-red-500">🔥 Spotlight:</span>Teamopipe - Best CRM for Gmail
        </a>
      </header>
      <nav className="bg-white border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">businesscrm.blog</h1>
        <div className="flex gap-4">
          <Button variant="ghost">Submit</Button>
          <Button variant="ghost">Get Featured</Button>
          <Button variant="ghost">Advertise</Button>
          <Button variant="outline">EN</Button>
        </div>
      </nav>
      <div className="flex flex-1">
        <aside className="w-64 border-r p-4">
          <h2 className="font-semibold mb-4">Categories</h2>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            <ul>
              <li className="py-2 hover:bg-gray-100 cursor-pointer">
                <Link href="/" onClick={() => handleCategoryFilter(null)}>All</Link>
              </li>
              {categories.map((category, index) => (
                <li key={index} className="py-2 hover:bg-gray-100 cursor-pointer">
                  <Link href={`/category/${category.toLowerCase()}`} onClick={() => handleCategoryFilter(category)}>{category}</Link>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </aside>
        <main className="flex-1 p-6">
          <h2 className="text-3xl font-bold mb-6">Supercharge Yourself And Your Business</h2>
          <p className="text-xl mb-8">Discover top CRM tools to elevate your customer relationships and streamline business processes at businesscrm.blog</p>
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input className="pl-10" placeholder="Search tool by name" />
          </div>
          <div className="flex justify-between mb-8">
            <Button 
              className="bg-black text-white"
              onClick={() => window.open('https://tally.so/r/3lWl0v', '_blank', 'noopener,noreferrer')}
            >
              + Submit CRM
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open('https://refined.so/compose', '_blank', 'noopener,noreferrer')}>
              <Mail size={16} />
              Receive New Tools
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.length > 0 ? (
              filteredTools.map((tool, index) => (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => window.open(`https://${tool.website}`, '_blank', 'noopener,noreferrer')}
                      >
                        <ExternalLink size={14} />
                        Visit
                      </Button>
                    </div>
                    <Link href={`/tool/${tool.slug}`}>
                      <CardTitle className="mt-4 hover:underline cursor-pointer">{tool.name}</CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4">{tool.description}</CardDescription>
                    <div className="flex flex-wrap gap-2">
                      {tool.categories.map((category, catIndex) => (
                        <Badge key={catIndex} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <p>No tools available for the selected category</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}