import { Save, Upload } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { api, getErrorMessage } from "../lib/api";
import type { Profile } from "../lib/types";

const maritalStatusOptions = ["Single", "Married", "Widowed", "Separated", "Divorced"];

const emptyForm = {
  name: "",
  dateOfBirth: "",
  age: "",
  height: "",
  gender: "",
  maritalStatus: "",
  qualification: "",
  profession: "",
  income: "",
  community: "",
  languages: "",
  fatherName: "",
  motherName: "",
  parentsContactNumber: "",
  parentsAlternateContactNumber: "",
  telegramNumber: "",
  familyStatus: "",
  homeTown: "",
  currentResidence: "",
  siblings: "",
  localFaithHome: "",
  centerFaithHome: "",
  expectations: "",
  photo: ""
};

type ProfileForm = typeof emptyForm;

export function MyProfilePage() {
  const [form, setForm] = useState<ProfileForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get<Profile>("/profile/me");
        setForm({
          name: data.name || "",
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : "",
          age: data.age ? String(data.age) : "",
          height: data.height || "",
          gender: data.gender || "",
          maritalStatus: data.maritalStatus || "",
          qualification: data.qualification || "",
          profession: data.profession || "",
          income: data.income || "",
          community: data.community || "",
          languages: data.languages?.join(", ") || "",
          fatherName: data.fatherName || "",
          motherName: data.motherName || "",
          parentsContactNumber: data.parentsContactNumber || "",
          parentsAlternateContactNumber: data.parentsAlternateContactNumber || "",
          telegramNumber: data.telegramNumber || "",
          familyStatus: data.familyStatus || "",
          homeTown: data.homeTown || "",
          currentResidence: data.currentResidence || "",
          siblings: data.siblings || "",
          localFaithHome: data.localFaithHome || "",
          centerFaithHome: data.centerFaithHome || "",
          expectations: data.expectations || "",
          photo: data.photo || ""
        });
      } catch {
        setMessage("Create your profile to become visible in browse.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handlePhoto = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setForm((current) => ({ ...current, photo: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");

    if (form.parentsContactNumber && !/^\d{10}$/.test(form.parentsContactNumber)) {
      setMessage("Parent's contact number must be exactly 10 digits.");
      setSaving(false);
      return;
    }

    try {
      await api.put("/profile/me", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        languages: form.languages.split(",").map((item) => item.trim()).filter(Boolean)
      });
      setMessage("Profile saved successfully.");
    } catch (err) {
      setMessage(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="card p-8 text-center text-slate-500">Loading profile...</div>;
  }

  return (
    <form className="space-y-8" onSubmit={handleSubmit}>
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rosewood">My Profile</p>
          <h1 className="mt-2 text-4xl font-bold text-ink">Build your introduction</h1>
        </div>
        <button className="btn-primary" disabled={saving}>
          <Save size={18} />
          {saving ? "Saving..." : "Save profile"}
        </button>
      </div>

      {message ? <p className="card p-4 text-sm font-semibold text-slate-700">{message}</p> : null}

      <section className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="card h-fit p-5">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-blush">
            {form.photo ? (
              <img src={form.photo} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full place-items-center text-center text-sm font-semibold text-rosewood">Upload photo</div>
            )}
          </div>
          <label className="btn-secondary mt-4 w-full cursor-pointer">
            <Upload size={18} />
            Upload photo
            <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
          </label>
        </div>

        <div className="card space-y-6 p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput label="Name" name="name" value={form.name} onChange={updateField} required />
            <TextInput label="Date of Birth" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={updateField} />
            <TextInput label="Age" name="age" value={form.age} onChange={updateField} />
            <TextInput label="Height" name="height" value={form.height} onChange={updateField} />

            <div>
              <label className="label" htmlFor="gender">Gender</label>
              <select id="gender" className="input mt-2" value={form.gender} onChange={(e) => updateField("gender", e.target.value)} required>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <TextInput label="Qualification" name="qualification" value={form.qualification} onChange={updateField} />
            <TextInput label="Profession" name="profession" value={form.profession} onChange={updateField} />
            <TextInput label="Income" name="income" value={form.income} onChange={updateField} />
            <TextInput label="Community" name="community" value={form.community} onChange={updateField} />
            <TextInput label="Languages Known" name="languages" value={form.languages} onChange={updateField} />
            <TextInput label="Father's Name" name="fatherName" value={form.fatherName} onChange={updateField} />
            <TextInput label="Mother's Name" name="motherName" value={form.motherName} onChange={updateField} />
            <TextInput label="Parent's Contact Number" name="parentsContactNumber" value={form.parentsContactNumber} onChange={updateField} maxLength={10} />
            <TextInput label="Parent's Contact Number (Alternate)" name="parentsAlternateContactNumber" value={form.parentsAlternateContactNumber} onChange={updateField} />
            <TextInput label="Telegram Number" name="telegramNumber" value={form.telegramNumber} onChange={updateField} />
            <TextInput label="Family Status" name="familyStatus" value={form.familyStatus} onChange={updateField} placeholder='Middle Class, Upper Middle Class' />
            <TextInput label="Home Town" name="homeTown" value={form.homeTown} onChange={updateField} />
            <TextInput label="Current Residence" name="currentResidence" value={form.currentResidence} onChange={updateField} />
            <TextInput label="Siblings" name="siblings" value={form.siblings} onChange={updateField} />
            <TextInput label="Local Faith Home" name="localFaithHome" value={form.localFaithHome} onChange={updateField} />
            <TextInput label="Center Faith Home" name="centerFaithHome" value={form.centerFaithHome} onChange={updateField} />
          </div>

          <div>
            <p className="label">Marital Status</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {maritalStatusOptions.map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                    form.maritalStatus === status
                      ? "border-rosewood bg-blush text-rosewood"
                      : "border-slate-200 bg-white text-slate-600 hover:border-rosewood/40"
                  }`}
                  onClick={() => updateField("maritalStatus", status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="expectations">Expectations / Preferences</label>
            <textarea id="expectations" className="input mt-2 min-h-32" value={form.expectations} onChange={(e) => updateField("expectations", e.target.value)} />
          </div>
        </div>
      </section>
    </form>
  );
}

type TextInputProps = {
  label: string;
  name: keyof ProfileForm;
  value: string;
  onChange: (key: keyof ProfileForm, value: string) => void;
  type?: string;
  required?: boolean;
  maxLength?: number;
  placeholder?: string;
};

function TextInput({ label, name, value, onChange, type = "text", required, maxLength, placeholder }: TextInputProps) {
  return (
    <div>
      <label className="label" htmlFor={name}>{label}</label>
      <input
        id={name}
        className="input mt-2"
        type={type}
        value={value}
        required={required}
        maxLength={maxLength}
        placeholder={placeholder}
        onChange={(event) => onChange(name, event.target.value)}
      />
    </div>
  );
}
