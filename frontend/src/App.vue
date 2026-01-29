<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const employees = ref([])
const departments = ref([])

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const empForm = ref({ id: null, name: '', email: '', position: '', salary: '', departmentIds: [] })
const deptForm = ref({ id: null, name: '' })
const isEditEmp = ref(false)
const isEditDept = ref(false)
const itemToDelete = ref({ type: '', id: null })

const fetchData = async () => {
  try {
    const [empRes, deptRes] = await Promise.all([
      axios.get('/api/employees'),
      axios.get('/api/departments')
    ])
    employees.value = empRes.data.data
    departments.value = deptRes.data
  } catch (e) { console.error("Data fetch failed") }
}


const filteredEmployees = computed(() => {
  return employees.value.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})


const totalPages = computed(() => Math.ceil(filteredEmployees.value.length / itemsPerPage) || 1)
const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredEmployees.value.slice(start, start + itemsPerPage)
})

const saveEmployee = async () => {
  try {
    if (isEditEmp.value) {
      await axios.put(`/api/employees/${empForm.value.id}`, empForm.value)
    } else {
      await axios.post('/api/employees', empForm.value)
    }
    closeAndRefresh('modal-employee')
  } catch (e) { console.error("Simpan karyawan gagal") }
}

const saveDept = async () => {
  try {
    if (isEditDept.value) {
      await axios.put(`/api/departments/${deptForm.value.id}`, deptForm.value)
    } else {
      await axios.post('/api/departments', deptForm.value)
    }
    closeAndRefresh('modal-dept')
  } catch (e) { console.error("Simpan departemen gagal") }
}

const prepareDelete = (type, id) => {
  itemToDelete.value = { type, id }
  document.getElementById('modal-delete').showModal()
}

const confirmDelete = async () => {
  const { type, id } = itemToDelete.value
  try {
    await axios.delete(`/api/${type}s/${id}`)
    document.getElementById('modal-delete').close()
    fetchData()
  } catch (e) { console.error("Gagal menghapus") }
}

const openEmpModal = (data = null) => {
  isEditEmp.value = !!data
  empForm.value = data ? { ...data, departmentIds: data.Departments?.map(d => d.id) || [] } 
: { id: null, name: '', email: '', position: '', salary: '', departmentIds: [] }
  document.getElementById('modal-employee').showModal()
}

const openDeptModal = (data = null) => {
  isEditDept.value = !!data
  deptForm.value = data ? { ...data } : { id: null, name: '' }
  document.getElementById('modal-dept').showModal()
}

const closeAndRefresh = (modalId) => {
  document.getElementById(modalId).close()
  fetchData()
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 w-full overflow-x-hidden">
    
    <nav class="bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 sticky top-0 z-30 w-full shadow-sm">
      <div class="flex justify-between items-center w-full max-w-7xl mx-auto">
        <div class="flex items-center gap-2">
          <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-200 italic">HP</div>
          <h1 class="text-2xl ml-2 font-black text-slate-800 tracking-tighter uppercase italic">HR Portal</h1>
        </div>
      </div>
    </nav>

    <main class="p-6 md:p-10 max-w-7xl mx-auto space-y-10">
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
          <div class="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-3xl">👤</div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Karyawan</p>
            <h3 class="text-4xl font-black text-slate-800">{{ employees.length }}</h3>
          </div>
        </div>
        <div class="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-6">
          <div class="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-3xl">🏢</div>
          <div>
            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Departemen</p>
            <h3 class="text-4xl font-black text-slate-800">{{ departments.length }}</h3>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-8 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div class="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/50">
            <h2 class="text-xl font-black text-slate-800 uppercase tracking-tight">Data Karyawan</h2>
            <div class="flex gap-2 w-full sm:w-auto">
              <input 
                v-model="searchQuery" 
                type="text" 
                placeholder="Cari..." 
                class="input input-bordered input-sm rounded-xl font-bold w-full bg-white text-slate-800 border-slate-200 focus:border-indigo-500" 
              />
              <button @click="openEmpModal()" class="btn btn-primary btn-sm rounded-xl px-4 font-black text-xs uppercase">+ Tambah</button>
            </div>
          </div>
          
          <div class="overflow-x-auto">
            <table class="table w-full border-separate border-spacing-0">
              <thead>
                <tr class="text-slate-400 uppercase text-[9px] tracking-[0.2em] bg-slate-50/50">
                  <th class="p-5 pl-8">Karyawan</th>
                  <th class="p-5">Jabatan / Gaji</th>
                  <th class="p-5">Departemen</th>
                  <th class="p-5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50">
                <tr v-for="emp in paginatedEmployees" :key="emp.id" class="hover:bg-slate-50/80 transition-all">
                  <td class="pl-8 py-5">
                    <div class="font-black text-slate-800 text-sm uppercase">{{ emp.name }}</div>
                    <div class="text-[10px] text-slate-400 font-bold">{{ emp.email }}</div>
                  </td>
                  <td>
                    <div class="badge badge-ghost rounded-md font-black text-[9px] uppercase bg-slate-100 border-none mb-1">{{ emp.position || '-' }}</div>
                    <div class="text-[11px] font-bold text-slate-600">Rp {{ Number(emp.salary).toLocaleString('id-ID') }}</div>
                  </td>
                  <td>
                    <div v-if="emp.Departments?.length">
                      <div v-for="d in emp.Departments" :key="d.id" class="flex flex-col">
                        <span class="text-[10px] font-black text-indigo-600 uppercase">{{ d.name }}</span>
                        <span class="text-[8px] text-slate-400 font-bold italic">Assign : {{ new Date(d.EmployeeDepartment?.assignedAt).toLocaleDateString('id-ID') }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="flex justify-center gap-2">
                      <button @click="openEmpModal(emp)" class="btn btn-square btn-xs bg-indigo-50 border-none text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">⚙️</button>
                      <button @click="prepareDelete('employee', emp.id)" class="btn btn-square btn-xs bg-rose-50 border-none text-rose-600 hover:bg-rose-600 hover:text-white transition-all">✕</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="p-4 bg-slate-50/50 flex justify-between items-center border-t border-slate-100">
            <span class="text-[10px] font-bold text-slate-400 uppercase ml-4">Hal {{ currentPage }} / {{ totalPages }}</span>
            <div class="join">
              <button @click="currentPage--" :disabled="currentPage === 1" class="join-item btn btn-xs">«</button>
              <button @click="currentPage++" :disabled="currentPage >= totalPages" class="join-item btn btn-xs">»</button>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-6 border-b border-slate-50 flex justify-between items-center">
              <h2 class="text-sm font-black text-slate-800 uppercase tracking-widest">Departemen</h2>
              <button @click="openDeptModal()" class="btn btn-secondary btn-xs rounded-lg px-3 font-bold border-none">+ Tambah</button>
            </div>
            <div class="p-6 space-y-3">
              <div v-for="dept in departments" :key="dept.id" class="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <span class="font-black text-slate-600 text-[10px] uppercase tracking-wider">{{ dept.name }}</span>
                <div class="flex gap-2">
                  <button @click="openDeptModal(dept)" class="text-slate-300 hover:text-indigo-600 text-xs">⚙️</button>
                  <button @click="prepareDelete('department', dept.id)" class="text-slate-300 hover:text-rose-600 text-xs">✕</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <dialog id="modal-employee" class="modal backdrop-blur-sm">
      <div class="modal-box bg-white rounded-[2.5rem] p-10 max-w-2xl">
        <h3 class="font-black text-2xl text-slate-800 uppercase mb-8">{{ isEditEmp ? 'Edit Karyawan' : 'Tambah Karyawan' }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div class="form-control">
            <label class="label text-[10px] font-black text-slate-400 uppercase">Nama</label>
            <input v-model="empForm.name" type="text" class="input input-bordered bg-slate-50 rounded-2xl font-bold" />
          </div>
          <div class="form-control">
            <label class="label text-[10px] font-black text-slate-400 uppercase">Email</label>
            <input v-model="empForm.email" type="email" class="input input-bordered bg-slate-50 rounded-2xl font-bold" />
          </div>
          <div class="form-control">
            <label class="label text-[10px] font-black text-slate-400 uppercase">Jabatan</label>
            <input v-model="empForm.position" type="text" class="input input-bordered bg-slate-50 rounded-2xl font-bold" />
          </div>
          <div class="form-control">
            <label class="label text-[10px] font-black text-slate-400 uppercase">Gaji</label>
            <input v-model="empForm.salary" type="number" class="input input-bordered bg-slate-50 rounded-2xl font-bold" />
          </div>
          <div class="form-control md:col-span-2">
            <label class="label text-[10px] font-black text-slate-400 uppercase">Departemen</label>
            <select @change="e => empForm.departmentIds = [parseInt(e.target.value)]" class="select select-bordered bg-slate-50 rounded-2xl font-bold w-full">
              <option disabled :selected="!empForm.departmentIds.length">Pilih Departemen</option>
              <option v-for="d in departments" :key="d.id" :value="d.id" :selected="empForm.departmentIds.includes(d.id)">{{ d.name }}</option>
            </select>
          </div>
        </div>
        <div class="flex gap-4">
          <form method="dialog" class="flex-1"><button class="btn btn-ghost w-full rounded-2xl font-bold">Batal</button></form>
          <button @click="saveEmployee" class="btn btn-primary flex-[2] rounded-2xl font-black uppercase">Simpan</button>
        </div>
      </div>
    </dialog>

    <dialog id="modal-dept" class="modal backdrop-blur-sm">
      <div class="modal-box bg-white rounded-[2rem] p-8 max-w-sm">
        <h3 class="font-black text-lg mb-6 ">{{ isEditDept ? 'Edit Departemen' : 'Tambah Departemen' }}</h3>
        <input v-model="deptForm.name" type="text" class="input input-bordered w-full bg-slate-50 rounded-xl font-bold" />
        <div class="modal-action gap-2 mt-8">
          <form method="dialog"><button class="btn btn-ghost rounded-xl">Batal</button></form>
          <button @click="saveDept" class="btn btn-secondary rounded-xl px-8">Simpan</button>
        </div>
      </div>
    </dialog>

    <dialog id="modal-delete" class="modal backdrop-blur-sm">
      <div class="modal-box bg-white rounded-[2.5rem] p-8 max-w-sm text-center border shadow-2xl">
        <div class="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">⚠️</div>
        <h3 class="font-black text-xl text-slate-800 uppercase tracking-tighter">Hapus Data?</h3>
        <p class="py-4 text-sm text-slate-500 font-bold">Data tidak dapat dipulihkan kembali.</p>
        <div class="flex gap-3 mt-4">
          <form method="dialog" class="flex-1"><button class="btn btn-ghost w-full rounded-xl font-bold">Batal</button></form>
          <button @click="confirmDelete" class="btn btn-error flex-1 rounded-xl font-black text-white">Ya, Hapus</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop"><button>close</button></form>
    </dialog>

  </div>
</template>