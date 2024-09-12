import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

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

function slugify(domain: string): string {
  return domain.replace(/[^a-z0-9]/gi, '-').toLowerCase();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Tool[]>
) {
  try {
    console.log('Handler function started');

    const sheetId = "1S-PkW1G1pKfp0A9Adwxs0VFwFGaxNTgvh1C6Z-d1Gnk";
    const sheetName = 'Sheet1';
    const range = 'D:J'; // Range covering all columns from D to J

    const apiKey = 'AIzaSyDYa0rYf0Sib7PmxP5QndHd81-xsDorO-0';
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}!${range}?key=${apiKey}`;
    console.log('URL constructed:', url);

    const response = await axios.get(url);
    console.log('Response received from Google Sheets');

    const rows = response.data.values;
    console.log('Number of rows received:', rows ? rows.length : 0);

    if (!rows || rows.length === 0) {
      console.log('No rows found, returning empty array');
      return res.status(200).json([]);
    }

    console.log('Processing rows into tools');
    // Skip the header row
    const tools: Tool[] = rows.slice(1).map((row: any) => {
      const website = row[1] || '';
      return {
        name: row[0] || '',
        website: website,
        description: row[2] || '',
        logo: row[3] || '',
        categories: row[4] ? row[4].split(',').map((cat: string) => cat.trim()) : [],
        email: row[5] || '',
        published: true,
        slug: slugify(website.split('.')[0]) // Create slug from the first part of the domain
      };
    });

    console.log('Processed tools:', tools);
    res.status(200).json(tools);
  } catch (error) {
    console.error('Error fetching tools:', error);
    res.status(500).json([]);
  }
}