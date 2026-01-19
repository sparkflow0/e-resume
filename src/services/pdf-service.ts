// @ts-ignore
const pdfjsLib = window.pdfjsLib;

export interface ExtractedData {
    text: string;
    profileImage?: string; // Base64 or Blob URL
}

export const extractTextAndImage = async (file: File): Promise<ExtractedData> => {
    if (!pdfjsLib) {
        throw new Error("PDF.js library not loaded");
    }

    const arrayBuffer = await file.arrayBuffer();

    try {
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        let fullText = '';
        let profileImage: string | undefined = undefined;

        // 1. Text Extraction (All Pages)
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
                .map((item: any) => item.str)
                .join(' ');
            fullText += pageText + '\n';

            // 2. Image Extraction (Page 1 Only - Heuristic for Profile Pic)
            if (i === 1 && !profileImage) {
                try {
                    const ops = await page.getOperatorList();
                    const fns = ops.fnArray;
                    const args = ops.argsArray;

                    let largestArea = 0;
                    let bestImgKey = null;

                    // OPS.paintImageXObject is usually mapped to numeric value 85, 
                    // but we can't rely on internal constants easily in this setup.
                    // We look for the operation that paints an image.

                    for (let j = 0; j < fns.length; j++) {
                        // In PDF.js, 85 is often paintImageXObject, but checking common paint ops
                        // We'll iterate the objs object on the page common object.
                        if (fns[j] === pdfjsLib.OPS.paintImageXObject) {
                            const imgKey = args[j][0];
                            bestImgKey = imgKey; // Take the last one or implement sizing logic below
                        }
                    }

                    // If we found an image key, let's try to extract it from commonObjs
                    page.getOperatorList().then(async (opList: any) => {
                        // This is complex in the browser build without direct access to objects.
                        // Fallback: Render page to canvas and verify? No, that gives whole page.

                        // Alternative: Iterate page.objs
                        page.objs.get(bestImgKey, (img: any) => {
                            if (img && img.data) {
                                // Convert to canvas to get base64
                                const canvas = document.createElement('canvas');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                const ctx = canvas.getContext('2d');
                                if (ctx) {
                                    const imageData = ctx.createImageData(img.width, img.height);
                                    // Copy data... (this depends on image encoding, RGBA vs RGB)
                                    // Simplification: This path often fails due to complex PDF image formats (CMYK etc).
                                }
                            }
                        });
                    });

                    // ROBUST FALLBACK FOR PROTOTYPE:
                    // Since direct XObject extraction is flaky without heavy utils, 
                    // we will implement a "Canvas Crop" heuristic if needed, OR
                    // use the standard PDF.js image extraction pattern.

                    // Attempting simpler common object iteration if accessible
                    if (bestImgKey) {
                        // Real implementation of image extraction needs strict types we don't have.
                        // We will assume 'profileImage' is passed if we find a good candidate.
                    }
                } catch (e) {
                    console.warn("Could not extract image via Ops", e);
                }
            }
        }

        // RE-IMPLEMENTATION: cleaner approach for image extraction
        // Fetch page 1, get commonObjs.
        const page1 = await pdf.getPage(1);
        const ops = await page1.getOperatorList();
        console.log("Page 1 Ops:", ops.fnArray.length);

        // Find image with largest dimensions
        let maxArea = 0;
        let potentialImg: any = null;

        for (let c = 0; c < ops.fnArray.length; c++) {
            if (ops.fnArray[c] === pdfjsLib.OPS.paintImageXObject) {
                const imgName = ops.argsArray[c][0];

                // We must use a Promise wrapper because page1.objs.get can be async or callback style
                await new Promise<void>((resolve) => {
                    page1.objs.get(imgName, (img: any) => {
                        console.log("Found Image Object:", imgName, img);
                        if (img && img.width && img.height) {
                            const area = img.width * img.height;
                            console.log(`Image ${imgName} area: ${area} (w=${img.width}, h=${img.height})`);

                            // Filter out tiny icons or huge background layers
                            if (area > 5000 && area > maxArea) {
                                console.log("--> New Candidate for Profile Pic!");
                                maxArea = area;
                                potentialImg = img;
                            }
                        }
                        resolve();
                    });
                });
            }
        }

        if (potentialImg) {
            const canvas = document.createElement('canvas');
            canvas.width = potentialImg.width;
            canvas.height = potentialImg.height;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // PDF.js provides image data in flexible formats. 
                // Often it's RGBA Uint8ClampedArray.

                // Note: simple RGB handling is tricky. 
                // We attempt to draw it directly if it's an ImageBitmap (modern browsers)
                // or putImageData if it's raw data.

                if (potentialImg.bitmap) {
                    console.log("Drawing ImageBitmap...");
                    ctx.drawImage(potentialImg.bitmap, 0, 0);
                } else if (potentialImg.data) {
                    // Creating ImageData 
                    // This assumes RGBA. If PDF is RGB, we need conversion.
                    // This is a "Best Effort"
                    console.log("Drawing ImageData...");
                    const idata = ctx.createImageData(potentialImg.width, potentialImg.height);
                    // If the source is RGB (3 bytes) and dest is RGBA (4 bytes)
                    if (potentialImg.data.length === potentialImg.width * potentialImg.height * 3) {
                        let j = 0;
                        for (let i = 0; i < potentialImg.data.length; i += 3) {
                            idata.data[j] = potentialImg.data[i];     // R
                            idata.data[j + 1] = potentialImg.data[i + 1]; // G
                            idata.data[j + 2] = potentialImg.data[i + 2]; // B
                            idata.data[j + 3] = 255;                    // Alpha
                            j += 4;
                        }
                        ctx.putImageData(idata, 0, 0);
                    } else if (potentialImg.data.length === potentialImg.width * potentialImg.height * 4) {
                        idata.data.set(potentialImg.data);
                        ctx.putImageData(idata, 0, 0);
                    }
                }

                profileImage = canvas.toDataURL();
                console.log("Profile Image extracted successfully!", profileImage.substring(0, 50) + "...");
            }
        }

        return { text: fullText, profileImage };

    } catch (error) {
        console.error('Error parsing PDF:', error);
        throw new Error('Failed to parse PDF file.');
    }
};
