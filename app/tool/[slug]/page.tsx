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
  slug: string;
};

export default function ToolPage() {
  const params = useParams()
  const slug = params.slug as string
  const [tool, setTool] = useState<Tool | null>(null);

  useEffect(() => {
    async function fetchTool() {
      try {
        const response = await fetch('/api/getTools');
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        const foundTool = data.find((t: Tool) => t.slug === slug);
        setTool(foundTool || null);
      } catch (error) {
        console.error('Error fetching tool:', error);
      }
    }

    fetchTool();
  }, [slug]);

  if (!tool) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b p-4">
        <h1 className="text-2xl font-bold">
          <Link href="/">businesscrm.blog</Link> - {tool.name}
        </h1>
      </header>
      <main className="flex-1 p-6">
        <Card>
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
                Visit Website
              </Button>
            </div>
            <CardTitle className="mt-4">{tool.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="mb-4">{tool.description}</CardDescription>
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.categories.map((category, index) => (
                <Badge key={index} variant="secondary">{category}</Badge>
              ))}
            </div>
            <p><strong>Email:</strong> {tool.email}</p>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}