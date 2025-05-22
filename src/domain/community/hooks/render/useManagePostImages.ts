import { useState, useEffect } from 'react';

export type ImageData = {
    file: File;
    preview: string; // base64 string
};

const MAX_IMAGES = 5;

// base64 -> File 변환 헬퍼
function base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}

const DB_NAME = 'ManagePostDB';
const STORE_NAME = 'posts';

// IndexedDB 유틸
const dbUtils = {
    async get() {
        return window.indexedDB
            ? (await import('idb')).openDB(DB_NAME, 1, {
                upgrade(db) {
                    if (!db.objectStoreNames.contains(STORE_NAME)) {
                        db.createObjectStore(STORE_NAME);
                    }
                },
            })
            : null;
    },
    async save(content: string, images: string[]) {
        const db = await this.get();
        if (db) {
            await db.put(STORE_NAME, { content, images }, 'post');
        }
    },
    async load(): Promise<{ content: string; images: string[] } | undefined> {
        const db = await this.get();
        if (db) {
            return db.get(STORE_NAME, 'post');
        }
        return undefined;
    },
    async clear() {
        const db = await this.get();
        if (db) {
            await db.delete(STORE_NAME, 'post');
        }
    },
};

export function useManagePostImages() {
    const [content, setContent] = useState('');
    const [imageDataList, setImageDataList] = useState<ImageData[]>([]);

    // 복원
    useEffect(() => {
        (async () => {
            const saved = await dbUtils.load();
            if (saved) {
                setContent(saved.content || '');
                setImageDataList(
                    saved.images?.map((base64, idx) => ({
                        file: base64ToFile(base64, `restored_${idx}.png`),
                        preview: base64,
                    })) || []
                );
            }
        })();
    }, []);

    // 저장
    useEffect(() => {
        const base64Images = imageDataList.map((img) => img.preview);
        dbUtils.save(content, base64Images).catch(console.error);
    }, [content, imageDataList]);

    // 이미지 선택 처리 함수
    const handleImageSelect = async (files: FileList | null) => {
        if (!files) return;

        const fileArray = Array.from(files);
        if (imageDataList.length + fileArray.length > MAX_IMAGES) {
            alert(`이미지는 최대 ${MAX_IMAGES}장까지만 업로드할 수 있습니다.`);
            return;
        }

        const selected = fileArray.slice(0, MAX_IMAGES - imageDataList.length);

        const newImages = await Promise.all(
            selected.map(
                (file) =>
                    new Promise<ImageData>((resolve) => {
                        const reader = new FileReader();
                        reader.onloadend = () =>
                            resolve({ file, preview: reader.result as string });
                        reader.readAsDataURL(file);
                    })
            )
        );

        setImageDataList((prev) => [...prev, ...newImages]);
    };

    // 이미지 삭제 함수
    const removeImage = (index: number) => {
        setImageDataList((prev) => prev.filter((_, i) => i !== index));
    };

    // 저장된 데이터 삭제 (IndexedDB 초기화)
    const clearStorage = async () => {
        await dbUtils.clear();
        setContent('');
        setImageDataList([]);
    };

    return {
        content,
        setContent,
        imageDataList,
        setImageDataList,
        handleImageSelect,
        removeImage,
        clearStorage,
        MAX_IMAGES,
    };
}
