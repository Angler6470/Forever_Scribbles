// Inside Uploader.tsx, replace the try/catch block with this:
    try {
      const response = await fetch('/api/generate', { method: 'POST', body: formData });
      
      // Get text first to debug
      const text = await response.text();
      
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        console.error("Raw server output:", text);
        throw new Error("Server returned an invalid response (not JSON). Check Vercel logs.");
      }

      if (!response.ok) throw new Error(json.error || "Generation failed");
      setResult(Array.isArray(json.result) ? json.result[0] : json.result);
    } catch (err: any) {
      setError(err.message);
    }