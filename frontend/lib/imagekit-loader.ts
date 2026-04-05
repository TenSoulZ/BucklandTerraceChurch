import { ImageLoaderProps } from 'next/image';

export const imageKitLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // If src is an absolute URL, return it as is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }

  let path = src;
  if(path[0] === "/") path = path.slice(1);
  
  const params = [`w-${width}`];
  if (quality) {
    params.push(`q-${quality}`);
  }
  const paramsString = params.join(",");
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/tensoulz/bucklandterrace";
  
  if (urlEndpoint[urlEndpoint.length - 1] === "/") {
    return `${urlEndpoint}${path}?tr=${paramsString}`;
  }
  return `${urlEndpoint}/${path}?tr=${paramsString}`;
};

export default imageKitLoader;
