import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

const EmergencyResource: React.FC<{ title: string; phone: string; textLine?: string; website: string }> = ({ title, phone, textLine, website }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <a href={`tel:${phone.replace(/\D/g,'')}`} className="flex items-center text-blue-500 hover:text-blue-600 mb-2">
      <Phone size={18} className="mr-2" />
      {phone}
    </a>
    {textLine && (
      <a href={website} className="flex items-center text-blue-500 hover:text-blue-600 mb-2">
        <MessageSquare size={18} className="mr-2" />
        {textLine}
      </a>
    )}
    <a href={website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600 underline">
      Visit Website
    </a>
  </div>
);

const EmergencyResources: React.FC = () => (
  <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg shadow-lg">
    <h2 className="text-2xl font-bold mb-6 text-red-600">Emergency Resources</h2>
    <EmergencyResource 
      title="National Suicide Prevention Lifeline" 
      phone="1-800-273-8255"
      website="https://suicidepreventionlifeline.org"
    />
    <EmergencyResource 
      title="Crisis Text Line" 
      phone="1-800-273-8255"
      textLine="Text HOME to 741741"
      website="https://www.crisistextline.org"
    />
    <EmergencyResource 
      title="SAMHSA's National Helpline" 
      phone="1-800-662-4357"
      website="https://www.samhsa.gov/find-help/national-helpline"
    />
    <EmergencyResource 
      title="National Domestic Violence Hotline" 
      phone="1-800-799-7233"
      website="https://www.thehotline.org"
    />
    <EmergencyResource 
      title="RAINN National Sexual Assault Hotline" 
      phone="1-800-656-4673"
      website="https://www.rainn.org"
    />
  </div>
);

export default EmergencyResources;