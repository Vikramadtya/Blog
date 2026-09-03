import { compile } from '@mdx-js/mdx';
import rehypePrettyCode from 'rehype-pretty-code';

const code = `
\`\`\`bash
sudo lsof -i :<portnumber>
\`\`\`
`;

const options = {
  theme: {
    light: 'github-light',
    dark: 'github-dark',
  },
  keepBackground: true,
};

const result = await compile(code, {
  rehypePlugins: [[rehypePrettyCode, options]],
  jsx: true
});

console.log(result.value);
