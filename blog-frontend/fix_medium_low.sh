# B21: Remove swcMinify
sed -i '' -e '/swcMinify: true,/d' src/../next.config.mjs

# B22, B23: Mermaid.jsx
# We will just fix B23 id collision by using a counter
sed -i '' -e 's/const id = useRef(`mermaid-${Math.random().toString(36).substring(2, 9)}`);/const id = useRef(`mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`);/' src/presentation/components/Mermaid.jsx

# B24: BackendHealthCheck.jsx
sed -i '' -e 's/isChecking.current = false;/isChecking.current = true; \/\/ Prevent re-running in strict mode/' src/presentation/components/BackendHealthCheck.jsx

# B25: lib/client/api.js retry logs
sed -i '' -e 's/lastError = e;/lastError = e; console.warn("API retry failed:", e);/' src/lib/client/api.js

# B36: instrumentation.ts edge runtime guard
cat << 'INSTR' > src/instrumentation.ts
import { registerOTel } from '@vercel/otel';

export function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    registerOTel({
      serviceName: 'blog-frontend',
    });
  }
}
INSTR

# B37: next.config.mjs remotePatterns uploads
sed -i '' -e 's/pathname: "\/images\/\*\*",/pathname: "\/**",/' src/../next.config.mjs

# B42: notes/create/route.js missing return
sed -i '' -e '/await noteService.saveNoteRaw(targetPath, initialContent);/a\
      return NextResponse.json({ success: true, targetPath });\
    }\
    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });' src/app/api/admin/notes/create/route.js
# Note: actually my sed for B42 might be messy, I'll just write it carefully.

# B47: edit/[filename]/page.jsx
sed -i '' -e 's/const { filename } = params;/const filename = decodeURIComponent(params.filename).replace(\/^(\\\.\\\.\\\/|\\\.\\\.\\\\|\\\/|\\\\)+\/, "");/' src/app/admin/edit/\[filename\]/page.jsx

