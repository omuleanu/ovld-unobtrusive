import { defineConfig } from 'vite';
import { resolve } from 'path';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json';

const version = packageJson.version;

export default defineConfig({
    build: {
        minify: false,
        rollupOptions: {            
            input: {
                ovld: resolve(__dirname, 'src/ovld.js'),
                ovldUnobtrusive: resolve(__dirname, 'src/ovld.unobtrusive.js')
            },
            output: [
            {
                format: 'es',
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'ovldUnobtrusive') {
                        return `ovld.unobtrusive.js`;
                    }
                    
                    return `[name].js`;
                },
                dir: 'dist',
                exports: 'named'
            },
            
            {
                format: 'es',
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'ovldUnobtrusive') {
                        return `ovld.unobtrusive.min.js`;
                    }
                    
                    return `[name].min.js`; 
                },
                dir: 'dist',
                exports: 'named',
                plugins: [
                terser({
                    output: {
                        comments: false
                    }
                  })
                ]
            }]// end output                        
        }
    }
});