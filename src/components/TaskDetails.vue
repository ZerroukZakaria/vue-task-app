<template>
    <button class="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-4 mb-6 ml-3netlify deploy --prod" @click="navigateToTaskList">Go back</button>    
    <div class="bg-white p-4 rounded-md shadow-md w-full max-w-lg mx-auto mt-20 mb-30">
        <div v-if="isLoading" class="loading-container">
            <div class="loader mb-4"></div>
            <p>Loading task details...</p>
        </div>
        <div v-else-if="taskDetails" class="overflow-y-auto">
            <div class="flex flex-col space-y-6 rounded-md">
                <div class="md:w-1/2 mb-3">
                    <h2 class="text-3xl font-bold mb-6 text-blue-600">{{ taskDetails.title }}</h2>
                    <p class="mb-3"><strong></strong> {{ taskDetails.description }}</p>
                    <p class="mb-3"><strong></strong>
                        <input type="checkbox" v-model="taskDetails.status" @change="updateStatus" :true-value="'completed'" :false-value="'in progress'">
                        {{ taskDetails.status }}
                    </p>
                    <p class="mb-3"><strong>Due Date:</strong> {{ formatDate(taskDetails.due_date) }}</p>
                    <p class="mb-3"><strong>Created:</strong> {{ formatDate(taskDetails.created_at) }}</p>
                    <p class="mb-3"><strong>Updated:</strong> {{ formatDate(taskDetails.updated_at) }}</p>
                </div>
            </div>
            <button class="mt-4 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-4" @click="navigateToTaskEdit(taskDetails.id)">Edit Task</button>

            <button class="mt-4 p-2 bg-red-500 text-white rounded-md hover:bg-red-600" @click="deleteTask">Delete Task</button>


        </div>

    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import {formatDate} from '../../utils/utils.js'
import {authToken} from '../../utils/utils.js'
import { useRouter } from 'vue-router'
import {apiUrl} from '../../utils/utils.js'

export default {
    props: ['id'],
    methods: {

        navigateToTaskEdit(taskId) {
            this.$router.push({name: 'taskEdit', params:{id: taskId}})
        },

        navigateToTaskList() {
            this.$router.push({name: 'taskList'})
        }

    },  
   
    setup (props) {

        const taskDetails = ref(null)
        const isLoading = ref(true)
        const router = useRouter();

        onMounted(async() => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push({name: 'login'})
                    return;
                }
                const response = await axios.get(`${apiUrl}/tasks/${props.id}`, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                taskDetails.value = response.data.task
                console.log('Task details loaded successfully', response.data);
            }

            catch (error) {
                console.error('Error fetching task details', error);
            }
            finally {
                isLoading.value = false
            }
        })

        const updateStatus = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push({name: 'login'})
                    return;
                }
                const response = await axios.patch(`${apiUrl}/tasks/${props.id}`, {
                    status: taskDetails.value.status
                }, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                console.log('Task status updated successfully', response.data);
            }

            catch (error) {
                console.error('Error updating task status', error);
            }
        }

        const deleteTask = async () => {
            if (window.confirm('Are you sure you want to delete this task?')) {
                try{
                    const token = localStorage.getItem('token');
                    if (!token) {
                        router.push({name: 'login'})
                        return;
                }
                const response = await axios.delete(`${apiUrl}/tasks/${props.id}`, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                console.log('Task deleted successfully:', response.data);
                router.push({name: 'taskList'})

            }   

            catch(error) {
                console.error("Error deleting task", error);

                }
            }

        }

        return {taskDetails, formatDate, deleteTask, updateStatus, isLoading}   
    }
}
</script>

<style scoped>


.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.loader {
  border: 8px solid #f3f3f3; /* Light grey */
  border-top: 8px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  animation: spin 2s linear infinite;
  margin-bottom: 20px;
}


</style>

