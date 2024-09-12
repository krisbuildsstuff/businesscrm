'use client'

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

type Tool = {
  name: string;
  website: string;
  description: string;
  logo: string;
  categories: string[];
  email: string;
  published: boolean;
};

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as string
  const [tools, setTools] = useState<Tool[]>([]);

  useEffect(() => {
    async function fetchTools() {
      try {
        const response = await fetch('/api/getTools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        const filteredTools = data.filter((tool: Tool) => 
          tool.categories.map(cat => cat.toLowerCase()).includes(category.toLowerCase())
        );
        setTools(filteredTools);
      } catch (error) {
        console.error('Error fetching tools:', error);
      }
    }

    fetchTools();
  }, [category]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">
          <Link href="/">businesscrm.blog</Link> - {category.charAt(0).toUpperCase() + category.slice(1)} Tools
        </h1>
      </header>
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.length > 0 ? (
            tools.map((tool, index) => (
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
                  <CardTitle className="mt-4">{tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{tool.description}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    {tool.categories.map((cat, catIndex) => (
                      <Badge key={catIndex} variant="secondary">{cat}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p>No tools available for this category</p>
          )}
        </div>
      </main>
    </div>
  )
}