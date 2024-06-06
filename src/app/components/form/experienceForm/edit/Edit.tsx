"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { MdOutlineEditNote } from "react-icons/md";

type Props = {
  experienceId: string,
  editGetWorkExperience: (id: string) => Promise<void>
  formReset: () => void,
}

const Edit = ({
  experienceId,
  editGetWorkExperience,
  formReset
}: Props) => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <>
      {isEdit ? (
        <IoIosCloseCircleOutline
          size={35}
          className="absolute bottom-3 right-16 p-1 hovered"
          onClick={() => {
            formReset();
            setIsEdit(!isEdit);
          }}
        />
      ) : (
        <MdOutlineEditNote
          size={35}
          className="absolute bottom-3 right-16 p-1 hovered"
          onClick={() => {
            editGetWorkExperience(experienceId);
            setIsEdit(!isEdit);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}
    </>
  )
}

export default Edit;