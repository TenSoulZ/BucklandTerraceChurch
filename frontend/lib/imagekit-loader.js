export default function imageKitLoader({ src, width, quality }) {
  if(src[0] === "/") src = src.slice(1);
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/your_endpoint";
  
  if (urlEndpoint[urlEndpoint.length - 1] === "/") {
    return `${urlEndpoint}${src}?tr=${paramsString}`;
  }
  return `${urlEndpoint}/${src}?tr=${paramsString}`;
}
