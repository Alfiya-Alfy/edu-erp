import { useState } from "react";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { User, Phone, Mail, Edit2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

/**
 * Parent Management View
 * Handles Parent Information, Contact Details, and Relationships.
 */
export const ParentForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [parents] = useState([
    { id: "P5001", name: "Suresh Nath", student: "Amal Nath", phone: "+91 9876543210", email: "suresh@gmail.com", relation: "Father" },
    { id: "P5002", name: "Sunitha S", student: "Riya S", phone: "+91 9876543211", email: "sunitha@hotmail.com", relation: "Mother" },
    { id: "P5003", name: "Vikram V", student: "Kevin V", phone: "+91 9876543212", email: "vikram@gmail.com", relation: "Father" },
    { id: "P5004", name: "Meera Nair", student: "Sneha Nair", phone: "+91 9876543213", email: "meera@outlook.com", relation: "Mother" },
    { id: "P5005", name: "Rajesh K", student: "Arjun K", phone: "+91 9876543214", email: "rajesh@gmail.com", relation: "Father" },
  ]);

  const columns = [
    { header: "Name", accessor: "name", render: (p) => (
      <div className="flex items-center gap-3 font-medium text-gray-900">{p.name}</div>
    )},
    { header: "Student Link", accessor: "student", render: (p) => (
      <div className="flex items-center gap-2 text-blue-600">
        <User size={14} />
        <span>{p.student}</span>
      </div>
    )},
    { header: "Relation", accessor: "relation" },
    { header: "Contact", accessor: "phone", render: (p) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-gray-600 text-xs"><Phone size={12} /> {p.phone}</div>
        <div className="flex items-center gap-2 text-gray-600 text-xs"><Mail size={12} /> {p.email}</div>
      </div>
    )},
  ];

  const actions = (p) => (
    <div className="flex items-center gap-2">
      <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Edit2 size={18} /></button>
      <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg" onClick={() => toast.error("Deleting parent records requires super-admin approval")}><Trash2 size={18} /></button>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Parent & Guardian Directory</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Manage guardian information and student relationships.</p>
        </div>
      </div>

      <Table
        title="Parents"
        columns={columns}
        data={parents.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))}
        onAdd={() => setIsModalOpen(true)}
        onSearch={setSearchQuery}
        actions={actions}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Link New Parent/Guardian"
        size="xl"
      >
        <form className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            <Input label="Father's Name" placeholder="Full name of father" />
            <Input label="Mother's Name" placeholder="Full name of mother" />
            <Input label="Guardian Name" placeholder="Guardian name (if applicable)" />
            <Input label="Relationship" placeholder="e.g. Local Guardian" />
            
            <Input label="Primary Phone" type="tel" placeholder="e.g. 9876543210" required />
            <Input label="Alternate Phone" type="tel" placeholder="e.g. 9876543211" />
            <Input label="Email Address" type="email" placeholder="guardian@example.com" />
            <Input label="Student ID / Name" placeholder="Search for student..." required />

            <div className="md:col-span-2 lg:col-span-3">
              <Input label="Residential Address" placeholder="Full address" />
            </div>

            <Input label="Occupation" placeholder="e.g. Business, Engineer" />
            <Input label="Annual Income" type="text" placeholder="e.g. 5,00,000" />
            <Input label="Emergency Contact" placeholder="Secondary Phone" />
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Discard
            </Button>
            <Button type="submit" className="px-8 shadow-xl shadow-blue-200">
              Link Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
