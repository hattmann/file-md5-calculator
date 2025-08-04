export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Use POST with a file", { status: 405 });
    }

    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return new Response("Expected multipart/form-data", { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new Response("No file uploaded", { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("MD5", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

	const base64Hash = btoa(hashHex);


    return new Response(JSON.stringify({ base64_md5: base64Hash }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};

