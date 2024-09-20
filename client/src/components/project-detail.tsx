import React from 'react';
import config from '../config/config';

interface Project {
  title: string;
  description: string;
  thumbnail: string;
  links: string[];
  technologies: string[];
  features: string[];
  media: string[]; // Array of image URLs or video URLs
  search: string
}

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-lg border border-gray-200 bg-white">
      <img className="w-full h-48 object-cover rounded-t-lg" src={config.ASSETS[config.ENVIRONMENT] + '/media/' + project.thumbnail} alt={`${project.title} thumbnail`} />
      <h2 className="text-2xl font-semibold mt-4 mb-2">{project.title}</h2>
      <p className="text-gray-700 mb-4">{project.description}</p>

      <div className="mb-4">
        <h3 className="font-medium">Links:</h3>
        <ul className="list-disc list-inside">
          {project.links.map((link, index) => (
            <li key={index}>
              <a href={link} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-medium">Technologies:</h3>
        <ul className="list-disc list-inside">
          {project.technologies.map((tech, index) => (
            <li key={index} className="text-gray-700">{tech}</li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-medium">Features:</h3>
        <ul className="list-disc list-inside">
          {project.features.map((feature, index) => (
            <li key={index} className="text-gray-700">{feature}</li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-medium mb-2">Gallery:</h3>
        <div className="grid grid-cols-2 gap-4">
          {project.media.map((mediaItem, index) => (
            <img
              key={index}
              src={mediaItem}
              alt={`Gallery image ${index + 1}`}
              className="w-full h-40 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
