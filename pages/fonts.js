import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';

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

  function onChange(key, value) {
    setCategory(value);
    setFiles(currentIdx, {
      ...file,
      [key]: value
    });
  }

  function handleInputClick(event) {
    hiddenFileInput.current.click();
  }

  function getBase64(file) {
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
      return reader.result;
    };
  }

  function handleInputChange(event) {
    const fileUploaded = event.target.files[0];

    setFiles(currentIdx, {
      ...file,
      fileDataUrl: getBase64(fileUploaded),
      fileBlob: fileUploaded,
      saved: true
    });
  }

  return (
    <section className="m-4 border border-accents-1 p-4 rounded-md">
      <Select
        label={`Select Extension`}
        onChange={(e) => onChange('fileExtension', e.target.value)}
        value={category}
      >
        <Select.Option>otf</Select.Option>
        <Select.Option>woff</Select.Option>
        <Select.Option>woff2</Select.Option>
        <Select.Option>eof</Select.Option>
        <Select.Option>ttf</Select.Option>
      </Select>
      <br />
      <div class="flex items-center justify-center w-full">
        <label
          class="flex flex-col w-full h-32 border-4 rounded-md border-blue-200 border-dashed cursor-pointer"
          onClick={handleInputClick}
        >
          <div class="flex flex-col items-center justify-center pt-7">
            {ICONS.upload()}
            <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-white">
              Attach a font file
            </p>
          </div>
          <input
            accept="font/ttf,font/woff,font/woff2,font/eot,font/otf"
            type="file"
            ref={hiddenFileInput}
            class="hidden"
            onChange={handleInputChange}
          />
        </label>
      </div>
      <br />
      <section className="flex">
        {/* <button
          type="button"
          class="inline-flex items-center px-4 py-2 border-none rounded-md shadow-sm text-sm font-medium text-white bg-green hover:bg-green-400"
          disabled={category ? false : true}
        >
          Save
        </button> */}
        <button
          type="button"
          onClick={() => removeItem(currentIdx)}
          class="inline-flex items-center px-4 py-2 border-none rounded-md shadow-sm text-sm font-medium text-white bg-red hover:bg-red outline-none"
        >
          Remove
        </button>
      </section>
    </section>
  );
}

function UploadForm() {
  const { selectedFonts, setSelectedFonts } = useFonts();
  const [category, setCategory] = useState('san-serif');
  const [files, setFiles] = useState([]);

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

  console.log(files)

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
    <div class="border border-accents-1	max-w-6xl w-full rounded-md m-auto my-8">
      <div class="">
        <section className="m-4">
          <label class="inline-block mb-2 text-white">Font Name</label>
          <Input
            type="text"
            placeholder="Font name e.g. Arial or arial"
            value={selectedFonts.name}
            onChange={(VALUE) => {
              setSelectedFonts((prev) => ({ ...prev, name: VALUE }));
            }}
          />
        </section>
        <section className="m-4">
          <Select
            label={`Select Category`}
            onChange={(e) => setCategory(e.target.value)}
            value={category}
          >
            <Select.Option>san-serif</Select.Option>
            <Select.Option>serif</Select.Option>
            <Select.Option>monospace</Select.Option>
          </Select>
        </section>
        <div class="m-4">
          <section className="flex justify-between place-items-center">
            <label class="inline-block mb-2 text-white">File Select</label>
            <Button className="w-auto" onClick={addFiles}>
              <span>Add File</span> {ICONS.plus('ml-2')}
            </Button>
          </section>
          {files.map((file, idx) => {
            return (
              <AttachFile
                file={file}
                key={idx}
                currentIdx={idx}
                setFiles={updateFile}
                removeItem={removeItem}
              />
            );
          })}
        </div>
        <div className="flex justify-center p-2">
          <Button className="w-full" disabled={!selectedFonts.name.length > 0}>
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Fonts() {
  const [loading, setLoading] = useState(false);
  const [fonts, setFonts] = useState([]);
  const router = useRouter();
  const { userLoaded, user, session, userDetails } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user && userLoaded) router.replace('/signin');
  }, [user]);

  return (
    <Layout title="Fonts">
      <FontProvider user={user}>
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
            {isOpen && <UploadForm />}
            <Card
              title="Your Email"
              description="Please enter the email address you want to use to login."
              footer={<p>We will email you to verify the change.</p>}
            >
              <p className="text-xl mt-8 mb-4 font-semibold">
                {user ? user.email : undefined}
              </p>
            </Card>
          </div>
        </section>
      </FontProvider>
    </Layout>
  );
}
