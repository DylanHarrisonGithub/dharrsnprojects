import React from 'react';
import { Project } from '../definitions/models/Project/Project';
import config from '../config/config';

interface ProjectCardProps {
  project: Project;
  mykey: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, mykey }) => {
  return (
    <a href={`/projects/?id=${project.id}`} className="block p-4 border rounded-lg shadow-lg transition-transform transform hover:scale-105 w-80 h-[60vh] overflow-y-auto" key={mykey}>
      <img className="w-full h-48 object-cover" src={config.ASSETS[config.ENVIRONMENT] + '/media/' + project.thumbnail} alt={`${project.title} thumbnail`} />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
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
        <div>
          <h3 className="font-medium">Features:</h3>
          <ul className="list-disc list-inside">
            {project.features.map((feature, index) => (
              <li key={index} className="text-gray-700">{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </a>
  );
};

export default ProjectCard;
