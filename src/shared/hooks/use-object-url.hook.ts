import { useEffect, useState } from 'react';

/**
 * React Hook that receives an instance of `File`, `Blob` or `MediaSource` and
 * creates an URL representing it, providing a state object containing the file
 * with a set function to change the file object. It releases URL when component
 * unmount or parameter changes.
 * @param initialObject - `null` or an instance of `File`, `Blob` or `MediaSource`.
 */
export const useObjectURL = (
  initialObject: null | File | Blob | MediaSource
) => {
  const [object, setObject] = useState<null | File | Blob | MediaSource>(
    initialObject
  );
  const [objectURL, setObjectURL] = useState<null | string>(null);

  useEffect(() => {
    if (!object) {
      return;
    }

    const objectURL = URL.createObjectURL(object);
    setObjectURL(objectURL);
    return () => {
      URL.revokeObjectURL(objectURL);
      setObjectURL(null);
    };
  }, [object]);

  return {
    object,
    objectURL,
    setObject,
  };
};