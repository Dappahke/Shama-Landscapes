import { supabase } from './supabase';

export async function uploadImage(file, folder = '') {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('project-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) throw error;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('project-images')
      .getPublicUrl(filePath);

    return { url: publicUrl, path: data.path };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function deleteImage(path) {
  try {
    const { error } = await supabase.storage
      .from('project-images')
      .remove([path]);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
}