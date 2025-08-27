export interface DownloadOptions {
  resourceId: string;
  format: 'pdf' | 'txt' | 'html';
  filename?: string;
}

export async function downloadResource(options: DownloadOptions): Promise<void> {
  try {
    const response = await fetch('/api/resources/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resourceId: options.resourceId,
        format: options.format,
      }),
    });

    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    // Get the filename from the response headers or use the provided one
    const contentDisposition = response.headers.get('content-disposition');
    let filename = options.filename;
    
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Create a blob from the response
    const blob = await response.blob();
    
    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `resource.${options.format}`;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Failed to download resource');
  }
}

export function showDownloadFormatDialog(resourceId: string, resourceTitle: string): void {
  // Create a simple modal for format selection
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  `;

  const dialog = document.createElement('div');
  dialog.style.cssText = `
    background: white;
    padding: 24px;
    border-radius: 12px;
    max-width: 400px;
    width: 90%;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  `;

  dialog.innerHTML = `
    <h3 style="margin: 0 0 16px 0; color: #1f2937; font-size: 18px; font-weight: 600;">
      Download "${resourceTitle}"
    </h3>
    <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">
      Choose your preferred format for downloading this resource.
    </p>
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <button class="format-btn" data-format="pdf" style="
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #374151;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;
      ">
        <strong>PDF Document</strong>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
          Best for printing and sharing
        </div>
      </button>
      <button class="format-btn" data-format="html" style="
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #374151;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;
      ">
        <strong>HTML Web Page</strong>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
          View in any web browser
        </div>
      </button>
      <button class="format-btn" data-format="txt" style="
        padding: 12px 16px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: white;
        color: #374151;
        cursor: pointer;
        text-align: left;
        transition: all 0.2s;
      ">
        <strong>Plain Text</strong>
        <div style="font-size: 12px; color: #6b7280; margin-top: 4px;">
          Simple text format
        </div>
      </button>
    </div>
    <div style="margin-top: 20px; text-align: right;">
      <button class="cancel-btn" style="
        padding: 8px 16px;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        background: white;
        color: #374151;
        cursor: pointer;
        margin-right: 8px;
      ">
        Cancel
      </button>
    </div>
  `;

  // Add event listeners
  const formatButtons = dialog.querySelectorAll('.format-btn');
  formatButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const format = (e.target as HTMLElement).getAttribute('data-format') as 'pdf' | 'txt' | 'html';
      
      try {
        // Show loading state
        (e.target as HTMLElement).textContent = 'Downloading...';
        (e.target as HTMLElement).style.background = '#f3f4f6';
        (e.target as HTMLElement).style.cursor = 'not-allowed';
        
        await downloadResource({
          resourceId,
          format,
        });
        
        // Close modal on success
        document.body.removeChild(modal);
        
      } catch (error) {
        alert('Download failed. Please try again.');
        // Reset button state
        (e.target as HTMLElement).textContent = format === 'pdf' ? 
          '<strong>PDF Document</strong><div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Best for printing and sharing</div>' :
          format === 'html' ?
          '<strong>HTML Web Page</strong><div style="font-size: 12px; color: #6b7280; margin-top: 4px;">View in any web browser</div>' :
          '<strong>Plain Text</strong><div style="font-size: 12px; color: #6b7280; margin-top: 4px;">Simple text format</div>';
        (e.target as HTMLElement).style.background = 'white';
        (e.target as HTMLElement).style.cursor = 'pointer';
      }
    });
    
    // Add hover effects
    btn.addEventListener('mouseenter', () => {
      (btn as HTMLElement).style.background = '#f9fafb';
      (btn as HTMLElement).style.borderColor = '#9ca3af';
    });
    
    btn.addEventListener('mouseleave', () => {
      (btn as HTMLElement).style.background = 'white';
      (btn as HTMLElement).style.borderColor = '#d1d5db';
    });
  });

  // Cancel button
  const cancelBtn = dialog.querySelector('.cancel-btn');
  cancelBtn?.addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // Add to DOM
  document.body.appendChild(modal);
}


