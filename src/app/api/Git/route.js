export async function GET(req) {
    const { owner, repo } = process.env; // Make sure these are set in your .env file
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      headers: {
        Authorization: `token ${process.env.GITHUB_TOKEN}`, // Your GitHub token
      },
    });
  
    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Failed to fetch commits" }), { status: response.status });
    }
  
    const commits = await response.json();
    return new Response(JSON.stringify(commits), { status: 200 });
}