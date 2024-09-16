import { promises as fs } from 'fs'
import * as Path from 'path';

import { Service, ServicePromise } from '../services';

import config from '../../config/config';

const parseErrorMessage = (fnName: string, e: any): string[] => [
  `Server - Services - File - ${fnName}: ${e.toString() || `Error: ${e.name || ``} ${e.message || `Unknown error.`}`}`
];

const file = ((): typeof service extends Service ? typeof service : never => {
  const service = {

    exists: async (filepath: string): ServicePromise => {
      try {
        await fs.access(config.ROOT_DIR + filepath, fs.constants.F_OK);
        return {
          success: true,
          messages: [
            `Server - Services - File - Exists: Successfully ${filepath} verified to exist.`,
          ]
        }
      } catch (e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - Exists: Error looking for ${filepath}`,
            ...parseErrorMessage(`Exist`, e)
          ]
        }      
      }
    },
    
    create: async (filepath: string, content: string): ServicePromise => {
      try {
        await fs.writeFile(config.ROOT_DIR + filepath, content);
        return {
          success: true,
          messages: [`Server - Services - File - Create: Successfully created ${filepath}`,]
        }
      } catch(e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - Create: Error creating ${filepath}`,
            ...parseErrorMessage(`Create`, e)
          ]
        }
      }
    },
    
    read: async (filepath: string): ServicePromise<string> => {
      try {
        const contents = await fs.readFile(config.ROOT_DIR + filepath, "utf8");
        return {
          success: true,
          messages: [`Server - Services - File - Read: Successfully read ${filepath}`,],
          body: contents
        }
      } catch(e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - Read: Error reading ${filepath}`,
            ...parseErrorMessage(`Read`, e)
          ]
        }
      }
    },
  
    update: async (filepath: string, content: string): ServicePromise => {
      try {
        await fs.appendFile(config.ROOT_DIR + filepath, content);
        return {
          success: true,
          messages: [`Server - Services - File - Update: Successfully updated ${filepath}.`,]
        }
      } catch(e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - Update: Error updating ${filepath}`,
            ...parseErrorMessage(`Update`, e)
          ]
        }
      }
    },
  
    delete: async (filepath: string): ServicePromise => {
      try {
        await fs.unlink(config.ROOT_DIR + filepath);
        return {
          success: true,
          messages: [`Server - Services - File - Delete: Successfully deleted ${filepath}.`,]
        }
      } catch(e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - Delete: Error deleting ${filepath}.`,
            ...parseErrorMessage(`Delete`, e)
          ]
        }
      }
    },
  
    move: async (srcpath: string, destpath: string): ServicePromise => {
      try {
        await fs.rename(config.ROOT_DIR + srcpath, config.ROOT_DIR +  destpath);
        return {
          success: true,
          messages: [`Server - Services - File - Move: Successfully moved ${srcpath} to ${destpath}.`,]
        }
      } catch(e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - Move: Error moving ${srcpath} to ${destpath}.`,
            ...parseErrorMessage(`Move`, e)
          ]
        }
      }
    },
  
    readDirectory: async (path: string): ServicePromise<string[]> => {
      try {
        const files = await fs.readdir(config.ROOT_DIR + path);
        return {
          success: true,
          messages: [`Server - Services - File - ReadDirectory: Successfully read directory ${path}.`,],
          body: files
        }
      } catch(e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - ReadDirectory: Error reading directory ${path}.`,
            ...parseErrorMessage(`ReadDirectory`, e)
          ]
        }
      }
    },
  
    createDirectory: async (path: string): ServicePromise => {
      try {
        await fs.mkdir(config.ROOT_DIR + path, { recursive: true });
        return {
          success: true,
          messages: [`Server - Services - File - CreateDirectory: Successfully created directory ${path}.`,]
        }
      } catch(e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - CreateDirectory: Error creating directory ${path}.`,
            ...parseErrorMessage(`CreateDirectory`, e)
          ]
        }
      }
    },
  
    deleteDirectory: async (path: string): ServicePromise => {
      try {
        await fs.rmdir(config.ROOT_DIR + path, { recursive: true });
        return {
          success: true,
          messages: [`Server - Services - File - DeleteDirectory: Successfully deleted directory ${path}.`,]
        }
      } catch(e) {
        return {
          success: false,
          messages: [
            `Server - Services - File - DeleteDirectory: Error deleting directory ${path}.`,
            ...parseErrorMessage(`DeleteDirectory`, e)
          ]
        }
      }
    },

    getDirectorySize: async (path: string): ServicePromise<number> => {

      try {
        const stats = await fs.stat(config.ROOT_DIR + path);
        if (!stats.isDirectory()) {
          return {
            success: false,
            messages: [
              `Server - Services - File - GETDIRECTORYSIZE: ${path} is not a directory.`,
            ]
          }   
        }
      } catch {
        return {
          success: false,
          messages: [
            `Server - Services - File - GETDIRECTORYSIZE: ${config.ROOT_DIR + path} does not exist or is inaccessable.`,
          ]
        }   
      }

      let totalSize = 0;

      async function calculateSize(filePath: string): Promise<void> {
        const stats = await fs.stat(filePath);
    
        if (stats.isFile()) {
          totalSize += stats.size;
        } else if (stats.isDirectory()) {
          const subFiles = await fs.readdir(filePath);
          for (const subFile of subFiles) {
            await calculateSize(Path.join(filePath, subFile));
          }
        }
      }

      await calculateSize(config.ROOT_DIR + path);
      return {
        success: true,
        messages: [
          `Server - Services - File - GETDIRECTORYSIZE: ${path} size calculated successfully.`,
        ],
        body: totalSize
      }
    }

  }
  return service;
})();

export default file;