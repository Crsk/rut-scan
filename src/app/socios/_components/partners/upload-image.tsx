import { useManagePartners } from '@/app/socios/_components/partners/partners.context'
import { UploadImagePlaceholder } from '@/app/socios/_components/partners/upload-image-placeholder'

export const UploadImage = () => {
  const {
    uploadImage: { inputRef, preview, handleImageChange }
  } = useManagePartners()

  return (
    <div>
      <label
        htmlFor="uploadFile"
        className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed mx-auto font-[sans-serif]"
      >
        {!preview ? (
          <>
            <UploadImagePlaceholder />
            Foto
          </>
        ) : (
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow" />
        )}
        <input ref={inputRef} type="file" id="uploadFile" className="hidden" onChange={handleImageChange} />
      </label>
    </div>
  )
}
