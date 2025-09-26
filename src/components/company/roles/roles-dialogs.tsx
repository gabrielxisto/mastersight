import AddDialog from "./add-dialog";
import EditDialog from "./edit-dialog";
import DeleteDialog from "./delete-dialog";

export default function({ 
  open, 
  onOpenChange, 
  data,
  submits 
}: { 
  open: boolean | string; 
  onOpenChange: (open: boolean) => void; 
  data: any;
  submits: { 
    add: (data: React.FormEvent<HTMLFormElement>, selectedDepartment: string) => void; 
    edit: (data: React.FormEvent<HTMLFormElement>, selectedDepartment: string) => void; 
    delete: (data: React.FormEvent<HTMLFormElement>) => void; 
  }; 
}) {
  return (
    <>
      <AddDialog 
        open={open === "add"} 
        onOpenChange={onOpenChange} 
        onSubmit={submits.add}
      />
      <EditDialog 
        open={open === "edit"} 
        onOpenChange={onOpenChange} 
        data={data}
        onSubmit={submits.edit}
      />
      <DeleteDialog 
        open={open === "delete"} 
        onOpenChange={onOpenChange} 
        data={data}
        onSubmit={submits.delete}
      />
    </>
  );
}