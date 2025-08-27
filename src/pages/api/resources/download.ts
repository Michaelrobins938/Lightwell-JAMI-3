import { NextApiRequest, NextApiResponse } from 'next';
import { comprehensiveContentData } from '../../../data/comprehensiveEducationalContent';
import { wellnessResourcesLibrary } from '../../../data/wellnessResourcesLibrary';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { resourceId, format = 'pdf' } = req.body;

    if (!resourceId) {
      return res.status(400).json({ message: 'Resource ID is required' });
    }

    // Find the resource in both data sources
    let resource = comprehensiveContentData.find(content => content.id === resourceId);
    
    if (!resource) {
      resource = wellnessResourcesLibrary.find(content => content.id === resourceId) as any;
    }
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Generate downloadable content based on format
    let downloadContent: string;
    let contentType: string;
    let filename: string;

    switch (format) {
      case 'pdf':
        contentType = 'application/pdf';
        filename = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
        downloadContent = generatePDFContent(resource);
        break;
      case 'txt':
        contentType = 'text/plain';
        filename = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
        downloadContent = generateTextContent(resource);
        break;
      case 'html':
        contentType = 'text/html';
        filename = `${resource.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.html`;
        downloadContent = generateHTMLContent(resource);
        break;
      default:
        return res.status(400).json({ message: 'Unsupported format' });
    }

    // Set headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', Buffer.byteLength(downloadContent, 'utf8'));

    // Send the content
    res.status(200).send(downloadContent);

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

function generatePDFContent(resource: any): string {
  // For now, return a simple text representation that can be converted to PDF
  // In a real implementation, you'd use a library like puppeteer or jsPDF
  
  // Handle different date formats
  let createdDate = 'Unknown';
  let updatedDate = 'Unknown';
  
  if (resource.createdAt) {
    createdDate = resource.createdAt instanceof Date ? resource.createdAt.toLocaleDateString() : resource.createdAt;
  }
  
  if (resource.updatedAt) {
    updatedDate = resource.updatedAt instanceof Date ? resource.updatedAt.toLocaleDateString() : resource.updatedAt;
  }
  
  if (resource.lastUpdated) {
    updatedDate = resource.lastUpdated;
  }
  
  const content = `
WELLNESS RESOURCE: ${resource.title}
===============================================

DESCRIPTION:
${resource.description}

CONTENT:
${resource.content.replace(/<[^>]*>/g, '')}

METADATA:
- Type: ${resource.type}
- Category: ${resource.category}
- Difficulty: ${resource.difficulty}
- Author: ${resource.author || 'Unknown'}
- Language: ${resource.language || 'English'}
- Tags: ${resource.tags.join(', ')}
- Created: ${createdDate}
- Updated: ${updatedDate}

${resource.dsm5Category ? `DSM-5 Category: ${resource.dsm5Category}` : ''}
${resource.researchYear ? `Research Year: ${resource.researchYear}` : ''}
${resource.evidenceLevel ? `Evidence Level: ${resource.evidenceLevel}` : ''}

This resource is part of the Luna Wellness Library.
For more information, visit our platform.
  `.trim();

  return content;
}

function generateTextContent(resource: any): string {
  // Handle different date formats
  let createdDate = 'Unknown';
  let updatedDate = 'Unknown';
  
  if (resource.createdAt) {
    createdDate = resource.createdAt instanceof Date ? resource.createdAt.toLocaleDateString() : resource.createdAt;
  }
  
  if (resource.updatedAt) {
    updatedDate = resource.updatedAt instanceof Date ? resource.updatedAt.toLocaleDateString() : resource.updatedAt;
  }
  
  if (resource.lastUpdated) {
    updatedDate = resource.lastUpdated;
  }
  
  return `
WELLNESS RESOURCE: ${resource.title}
===============================================

DESCRIPTION:
${resource.description}

CONTENT:
${resource.content.replace(/<[^>]*>/g, '')}

METADATA:
- Type: ${resource.type}
- Category: ${resource.category}
- Difficulty: ${resource.difficulty}
- Author: ${resource.author || 'Unknown'}
- Language: ${resource.language || 'English'}
- Tags: ${resource.tags.join(', ')}
- Created: ${createdDate}
- Updated: ${updatedDate}

${resource.dsm5Category ? `DSM-5 Category: ${resource.dsm5Category}` : ''}
${resource.researchYear ? `Research Year: ${resource.researchYear}` : ''}
${resource.evidenceLevel ? `Evidence Level: ${resource.evidenceLevel}` : ''}

This resource is part of the Luna Wellness Library.
For more information, visit our platform.
  `.trim();
}

function generateHTMLContent(resource: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resource.title} - Luna Wellness Resource</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
        .metadata { background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .tag { display: inline-block; background: #007bff; color: white; padding: 4px 8px; margin: 2px; border-radius: 4px; font-size: 12px; }
        .content { margin-top: 30px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${resource.title}</h1>
        <p><strong>${resource.description}</strong></p>
    </div>
    
    <div class="metadata">
        <h3>Resource Information</h3>
        <p><strong>Type:</strong> ${resource.type}</p>
        <p><strong>Category:</strong> ${resource.category}</p>
        <p><strong>Difficulty:</strong> ${resource.difficulty}</p>
        <p><strong>Author:</strong> ${resource.author || 'Unknown'}</p>
        <p><strong>Language:</strong> ${resource.language || 'English'}</p>
        <p><strong>Created:</strong> ${resource.createdAt ? (resource.createdAt instanceof Date ? resource.createdAt.toLocaleDateString() : resource.createdAt) : 'Unknown'}</p>
        <p><strong>Updated:</strong> ${resource.lastUpdated || (resource.updatedAt ? (resource.updatedAt instanceof Date ? resource.updatedAt.toLocaleDateString() : resource.updatedAt) : 'Unknown')}</p>
        
        ${resource.dsm5Category ? `<p><strong>DSM-5 Category:</strong> ${resource.dsm5Category}</p>` : ''}
        ${resource.researchYear ? `<p><strong>Research Year:</strong> ${resource.researchYear}</p>` : ''}
        ${resource.evidenceLevel ? `<p><strong>Evidence Level:</strong> ${resource.evidenceLevel}</p>` : ''}
        
        <p><strong>Tags:</strong> ${resource.tags.map((tag: any) => `<span class="tag">${tag}</span>`).join(' ')}</p>
    </div>
    
    <div class="content">
        <h3>Content</h3>
        ${resource.content}
    </div>
    
    <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #ccc; text-align: center; color: #666;">
        <p>This resource is part of the Luna Wellness Library.</p>
        <p>For more information and resources, visit our platform.</p>
    </div>
</body>
</html>
  `.trim();
}
