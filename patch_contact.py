import sys

with open("backend/contact.tezz", "r") as f:
    content = f.read()

new_get = """  GET "/api/contacts" {
    let db = createClient({
      url: env.TURSO_URL,
      token: env.TURSO_TOKEN
    })

    try {
      let result = await db.execute("SELECT * FROM contacts ORDER BY id DESC LIMIT 50")
      return {
        success: true,
        contacts: result.rows
      }
    } catch err {
      return { success: false, error: "Database error" }
    }
  }"""

# Find the old GET block and replace it
start_get = content.find('  GET "/api/contacts" {')
end_get = content.find('  POST "/api/contact" {')

if start_get != -1 and end_get != -1:
    content = content[:start_get] + new_get + "\n\n" + content[end_get:]

with open("backend/contact.tezz", "w") as f:
    f.write(content)

print("contact.tezz patched")
