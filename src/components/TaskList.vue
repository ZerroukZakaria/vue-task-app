<template>
    <div class="p-8 bg-gray-100 min-h-screen">
        <h2 class="text-3xl font-bold mb-6 text-blue-600">My Tasks</h2>

        <div class="mb-6">
            <label for="searchTerm" class="block text-sm font-medium text-gray-700">Search</label>
            <input v-model="searchTerm" type="text" name="searchTerm" id="searchTerm" @change="applyFilterAndSort" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">

        </div>

        <div class="mb-6 flex space-x-4">
            <div>
                <label for="statusFilter" class="block text-sm font-medium text-gray-700">Filter by Status</label>
                <select v-model="statusFilter" id="statusFilter" @change="applyFilterAndSort" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer">
                    <option value="All">All</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            <div>
                <label for="sortOrder" class="block text-sm font-medium text-gray-700">Sort by Due Date:</label>
                <select v-model="sortOrder" id="sortOrder" @change="applyFilterAndSort" class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer">
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                </select>
            </div>
        </div>

        <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <div v-for="task in paginatedTasks" :key="task.id" class="bg-white p-6 rounded-lg shadow-md cursor-pointer" @click="navigateToTaskDetails(task.id)">
                <h3 class="text-lg font-semibold mb-4 text-blue-600">{{ task.title }}</h3>
                <div class="mt-4 flex justify-between items-center">
                    <span :class="{'text-orange-500': task.status === 'in progress', 'text-green-500': task.status === 'completed'}" class="text-sm">{{ task.status }}</span>
                    <span class="text-sm text-gray-500">{{ formatDate(task.due_date) }}</span>
                </div>
            </div>
        </div>

        <button class="mt-6 p-2 w-full sm:w-auto bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="navigateToTaskCreate">Create Task</button>

        <div class="flex items-center justify-between mt-6">
            <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer" @click="prevPage" :disabled="currentPage === 1">Previous</button>
            <span class="text-lg">{{ currentPage }} / {{ totalPages }}</span>
            <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 cursor-pointer" @click="nextPage" :disabled="currentPage === totalPages">Next</button>

            <div class="logout-button"><button class="bg-blue-500 text-white rounded-md hover:bg-blue-600 p-2" @click="logout">Logout</button></div>
        </div>
    </div>
</template>

<script>
import { onMounted, ref, computed} from 'vue'
import axios from 'axios'
import {formatDate} from '../../utils/utils.js'
import {authToken} from '../../utils/utils.js'
import {apiUrl} from '../../utils/utils.js'
import draggable from 'vuedraggable'


export default {
    components: {
        draggable
    },
    methods: {
        // navigate to the task details
        navigateToTaskDetails(taskId) {
            this.$router.push({name: 'taskDetails', params:{id: taskId}})
        },

        // navigate to the task create        
        navigateToTaskCreate() {
            this.$router.push({name:'taskCreate'})
        },

        // logout the current user
        logout() {
            localStorage.removeItem('token')
            this.$router.push({ name: 'login' })
        }
    },
    setup () {

        const tasks = ref([])
        const statusFilter = ref('All')
        const sortOrder = ref('asc')
        const currentPage = ref(1)
        const perPage = ref(5)
        const searchTerm = ref('')        
        

        // sort and filter tasks
        const filteredAndSortedTasks = computed(() => {
            let filteredTasks = tasks.value

            if (statusFilter.value !== 'All') {
                filteredTasks = tasks.value.filter((task) => task.status === statusFilter.value)
            }

            if(searchTerm.value !== '') {
                filteredTasks = filteredTasks.filter((task) => task.title.toLowerCase().includes(searchTerm.value.toLowerCase()))
            }


            return filteredTasks.sort((a, b) => {
                const dateA = new Date(a.due_date)
                const dateB = new Date(b.due_date)

                if (sortOrder.value === 'asc') {
                return dateA - dateB
                } else {
                return dateB - dateA
                }
            })

    })

        // get paginated tasks
        const paginatedTasks = computed(() => {
            const startIndex = (currentPage.value - 1) * perPage.value
            const endIndex = startIndex + perPage.value
            return filteredAndSortedTasks.value.slice(startIndex, endIndex)
        })

        const totalPages = computed(() => {
            return Math.ceil(filteredAndSortedTasks.value.length / perPage.value)
        })

        function nextPage() {
            if (currentPage.value < totalPages.value) {
                currentPage.value++
            }
        }

        function prevPage() {
            if (currentPage.value > 1) {
                currentPage.value--
            }
        }

        // fetch the tasks if the user is logged in
        onMounted(async()=> {
            
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push({name: 'login'})
                    return
                }
                const response = await axios.get(`${apiUrl}/tasks`, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                tasks.value = response.data.tasks
                console.log('API request susscessful', response.data)

            }

            catch(error) {
                console.error("Error fetching tasks", error)
            }
        })

        return {tasks, filteredAndSortedTasks, formatDate, sortOrder, statusFilter,  paginatedTasks, currentPage, totalPages, nextPage, prevPage, searchTerm,  }
    }
}
</script>

<style scoped>
.logout-button {
  position: fixed;
  top: 10px;
  right: 10px;
}
</style>
