export type OmitDefaultData<T> = Omit<T, 'createdAt' | 'updatedAt' | 'id'>;
