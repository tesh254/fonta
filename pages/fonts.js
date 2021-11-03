import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import toast, { Toaster } from 'react-hot-toast';

import LoadingDots from '@/components/ui/LoadingDots';
import Button from '@/components/ui/Button';
import { useUser } from '@/utils/useUser';
import { postData } from '@/utils/helpers';
import Layout from '@/components/Layout';
import ICONS from '@/components/ui/Icons';
import { FontProvider } from 'context/FontProvider';
import { useFonts } from 'context/FontProvider';
import { Select } from '@supabase/ui';
import Input from '@/components/ui/Input';
import FontCardItem from '@/components/ui/FontCardItem';

function Card({ title, description, footer, children }) {
  return (
    <div className="border border-accents-1	max-w-6xl w-full p rounded-md m-auto my-8">
      <div className="px-5 py-4">
        <h3 className="text-2xl mb-1 font-medium">{title}</h3>
        <p className="text-accents-5">{description}</p>
        {children}
      </div>
      <div className="border-t border-accents-1 bg-primary-2 p-4 text-accents-3 rounded-b-md">
        {footer}
      </div>
    </div>
  );
}

function AttachFile({ setFiles, file, currentIdx, removeItem }) {
  const [category, setCategory] = useState('otf');
  const hiddenFileInput = useRef(null);
  const [fileBlob, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dataUrl, setDataUrl] = useState('');

  function onChange(key, value) {
    setCategory(value);
  }

  useEffect(() => {
    if (dataUrl && category) {
      setFiles(currentIdx, {
        fileExtension: category,
        fileDataUrl: dataUrl,
        fileBlob: fileBlob,
        fileId: currentIdx
      });
    }
  }, [category, dataUrl]);

  function handleInputClick(event) {
    // event.preventDefault();
    hiddenFileInput.current.click();
  }

  function getBase64(file) {
    if (file) {
      file instanceof Blob;

      let reader = new FileReader();

      reader.addEventListener(
        'load',
        function () {
          setDataUrl(reader.result);
        },
        false
      );

      return reader.readAsDataURL(file);
    }
  }

  function handleInputChange(event) {
    event.preventDefault();
    const fileUploaded = event.target.files[0];

    if (fileUploaded) {
      const fileName = event.target.files[0].name;

      const fileExtension = fileName.split('.').pop();

      const extensions = ['otf', 'woff', 'eot', 'woff2', 'ttf'];

      if (extensions.includes(fileExtension.toLowerCase())) {
        setFileName(event.target.files[0].name);

        setCategory(fileExtension);

        const res = getBase64(fileUploaded);

        setFile(fileUploaded);
      } else {
        toast.error(`Font of extension .${fileExtension} file not supported`);
      }
    }
  }

  return (
    <section className="m-4 border border-accents-1 p-4 rounded-md">
      <br />
      <div className="flex items-center justify-center w-full">
        <button
          className="flex flex-row justify-center outline-none w-full h-32 border-4 rounded-md border-blue-200 border-dashed cursor-pointer"
          onClick={handleInputClick}
        >
          <div className="flex flex-col items-center justify-center pt-7">
            {fileName ? (
              <>
                {ICONS.upload()}
                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-white">
                  {fileName}
                </p>
              </>
            ) : (
              <>
                {ICONS.upload()}
                <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-white">
                  Attach a font file
                </p>
              </>
            )}
          </div>
          <input
            accept="font/ttf,font/woff,font/woff2,font/eot,font/otf"
            type="file"
            ref={hiddenFileInput}
            className="hidden"
            onChange={handleInputChange}
          />
        </button>
      </div>
      <br />
      <section className="flex">
        {/* <button
          type="button"
          className="inline-flex items-center px-4 py-2 border-none rounded-md shadow-sm text-sm font-medium text-white bg-green hover:bg-green-400"
          disabled={category ? false : true}
        >
          Save
        </button> */}
        <button
          type="button"
          onClick={() => removeItem(currentIdx)}
          className="inline-flex items-center px-4 py-2 border-none rounded-md shadow-sm text-sm font-medium text-white bg-red hover:bg-red outline-none"
        >
          Remove
        </button>
      </section>
    </section>
  );
}

function UploadForm({ onSuccess }) {
  const {
    selectedFonts,
    setSelectedFonts,
    uploadFonts,
    uploadingFonts: loading
  } = useFonts();
  const [category, setCategory] = useState('sans-serif');
  const [name, setName] = useState('');
  const [files, setFiles] = useState([
    {
      fileExtension: '',
      fileDataUrl: null,
      fileBlob: null,
      fileId: 1,
      saved: false
    }
  ]);
  const [fontWeight, setFontWeight] = useState(300);

  useEffect(() => {
    const _files = files.filter((item) => item.fileDataUrl !== null);

    if (_files.length > 0 && name && category && fontWeight) {
      setSelectedFonts(() => ({
        name,
        category,
        fonts: [..._files],
        fontWeight
      }));
    }
  }, [files, category, name, fontWeight]);

  function addFiles() {
    const updatedFiles = [
      ...files,
      {
        fileExtension: '',
        fileDataUrl: null,
        fileBlob: null,
        fileId: files.length + 1,
        saved: false
      }
    ];

    setFiles(() => updatedFiles);
  }

  function updateFile(id, fileData) {
    const updatedObject = files.map((file) =>
      file.fileId === id ? fileData : file
    );

    setFiles(() => updatedObject);
  }

  function removeItem(id) {
    const updatedFiles = files.filter((item) => item.fileId === id);

    setFiles(() => updatedFiles);
  }

  return (
    <div className="border border-accents-1	max-w-6xl w-full rounded-md m-auto my-8">
      <div className="">
        <section className="m-4">
          <label className="inline-block mb-2 text-white">Font Name</label>
          <Input
            type="text"
            placeholder="Font name e.g. Arial or arial"
            value={name}
            onChange={(VALUE) => {
              setName(VALUE);
            }}
          />
        </section>
        <section className="m-4">
          <Select
            label={`Select Category`}
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <Select.Option>sans-serif</Select.Option>
            <Select.Option>serif</Select.Option>
            <Select.Option>monospace</Select.Option>
          </Select>
        </section>
        <section className="m-4">
          <label className="inline-block mb-2 text-white">Font Weight</label>
          <Input
            type="number"
            placeholder="Font weight e.g. 300 or 700"
            value={fontWeight}
            onChange={(VALUE) => {
              setFontWeight(VALUE);
            }}
          />
        </section>
        <div className="m-4">
          <section className="flex justify-between place-items-center">
            <label className="inline-block mb-2 text-white">File Select</label>
            <Button className="w-auto" onClick={addFiles}>
              <span>Add File</span> {ICONS.plus('ml-2')}
            </Button>
          </section>
          {files.map((file, idx) => {
            return (
              <AttachFile
                file={file}
                key={idx}
                currentIdx={file.fileId}
                setFiles={updateFile}
                removeItem={removeItem}
              />
            );
          })}
        </div>
        <div className="flex justify-center p-2">
          <Button
            onClick={() => {
              uploadFonts()
                .then(() => {})
                .catch(() => {});
            }}
            className="w-full"
            disabled={!selectedFonts.name.length > 0}
            loading={loading}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

function Fonts({ isOpen, setIsOpen }) {
  const { fonts, gettingFonts } = useFonts();

  return (
    <>
      <section className="bg-black mb-32">
        <div className="max-w-6xl mx-auto sm:pt-24 pb-2 px-2 sm:px-6 lg:px-2 w-full">
          <div className="sm:flex flex sm:flex-row place-items-center sm:align-center  justify-between">
            <h1 className="text-4xl font-extrabold text-white sm:text-left sm:text-6xl">
              Fonts
            </h1>
            <Button className="w-auto" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? (
                <>
                  <span>Cancel</span> {ICONS.close('ml-2')}
                </>
              ) : (
                <>
                  <span>Upload Font</span> {ICONS.upload('ml-2')}
                </>
              )}
            </Button>
          </div>
        </div>
        <div className="px-2 py-1">
          {isOpen && <UploadForm onSuccess={() => setIsOpen(false)} />}
          <section className="max-w-6xl mx-auto">
            {gettingFonts ? (
              <section className="flex justify-center place-items-center">
                <LoadingDots />
              </section>
            ) : (
              <>
                {fonts.map((_font, idx) => {
                  console.log(_font);
                  return (
                    <FontCardItem
                      {..._font}
                      key={idx}
                      font_link={`/font/${_font?.id}`}
                    />
                  );
                })}
              </>
            )}
          </section>
        </div>
      </section>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: '',
          duration: 5000,
          style: {
            background: '#363636',
            color: '#fff'
          },
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black'
            }
          }
        }}
      />
    </>
  );
}

export default function FontsContainer() {
  const router = useRouter();
  const { userLoaded, user, session, userDetails } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user && userLoaded) router.replace('/signin');
  }, [user]);

  return (
    <Layout title="Fonts">
      <FontProvider user={user} onFontSubmitSuccess={() => setIsOpen(false)}>
        <Fonts isOpen={isOpen} setIsOpen={setIsOpen} />
      </FontProvider>
    </Layout>
  );
}
