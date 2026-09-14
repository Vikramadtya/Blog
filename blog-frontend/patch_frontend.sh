for file in src/app/api/admin/**/*.js; do
  # Add import if not present
  if ! grep -q "checkAdminAuth" "$file"; then
    sed -i '' -e '1i\
import { checkAdminAuth } from "@/lib/auth";' "$file"
  fi
  
  # Replace development check with checkAdminAuth
  # We will match the block:
  # if (process.env.NODE_ENV !== "development") {
  #   return NextResponse.json({ error: "..." }, { status: 403 });
  # }
  sed -i '' -e 's/if (process\.env\.NODE_ENV !== "development") {/const authError = checkAdminAuth(req);\n  if (authError) return authError;\n  if (false) {/' "$file"
done
