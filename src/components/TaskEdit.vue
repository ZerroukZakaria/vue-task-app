<template>
    <div class="bg-white p-4 rounded-md shadow-md w-full max-w-lg mx-auto mt-20 mb-20">
        <h2 class="text-3xl font-bold mb-6 text-blue-600">Edit Task</h2>
        <form @submit.prevent="updateTask" class="mb-4">
            <label class="block text-sm font-medium text-gray-700" for="title">Title</label>
            <input class="mt-1 p-2 w-2/3 border rounded-md" v-model="form.title" type="text" id="title" name="title" />
            <div v-if="errors.title" class="text-red-500 text-sm mt-1">*{{ errors.title }}</div>

            <label class="block text-sm font-medium text-gray-700" for="description">Description</label>
            <textarea class="mt-1 p-2 w-2/3 border rounded-md" v-model="form.description" type="text" id="description" name="description"> </textarea>
            <div v-if="errors.description" class="text-red-500 text-sm mt-1">*{{ errors.description }}</div>

            <label class="block text-sm font-medium text-gray-700" for="status">Status</label>
            <div class="flex items-center ps-4 w-2/3">
                <input class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" v-model="form.status" type="checkbox" true-value="completed" false-value="in progress" id="status" name="status" />
                <span class="ml-2">{{ form.status }}</span>
            </div>


            <div v-if="errors.status" class="text-red-500 text-sm mt-1">*{{ errors.status }}</div>

            <label class="block text-sm font-medium text-gray-700" for="due_date">Due Date</label>
            <input class="mt-1 p-2 w-2/3 border rounded-md" v-model="form.due_date" type="date" id="due_date" name="due_date" />
            <div v-if="errors.due_date" class="text-red-500 text-sm mt-1">*{{ errors.due_date }}</div>

            <br/>
           <button class="mt-4 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" type="submit">Update Task</button>
        </form>
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import {authToken, apiUrl} from '../../utils/utils.js'
export default {
    props: ['id'],
    setup (props) {

        const router = useRouter();
        const route = useRoute()
        const taskId = route.params.id;

        const form = ref({
            title: '',
            description: '',
            status: '',
            due_date: ''
        });
        const errors = ref({});

        onMounted(async() => {
            console.log('Task ID:', taskId);
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push({name: 'login'})
                    return;
                }
                const response = await axios.get(`${apiUrl}/tasks/${taskId}`, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                form.value = response.data.task;
            } catch (error) {
                console.error('Error fetching task details', error);
            }
        })
        
        const validateForm = () => {
            let isValid = true;

            if (!form.value.title || form.value.title.length > 255) {
        errors.value.title = 'Title is required and must be less than 255 characters.';
        isValid = false;
    }

            if (!form.value.description) {
                errors.value.description = 'Description is required.';
                isValid = false;
            }

            if (!['in progress', 'completed'].includes(form.value.status)) {
                errors.value.status = 'Status must be either "in progress" or "completed".';
                isValid = false;
            }

            const dueDate = new Date(form.value.due_date)
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)

            if (!form.value.due_date || dueDate <= tomorrow) {
                errors.value.due_date = 'Due date is required and must be a future date.';
                isValid = false;
            }
                
            return isValid;
        }

        const updateTask = async () => {

            errors.value = {}

            if (!validateForm()) {
                return;
            }

            try {

                const token = localStorage.getItem('token');
                if (!token) {
                    router.push({name: 'login'})
                    return;
                }

                console.log('Button clicked - updateTask method called')  
                const response = await axios.put(`${apiUrl}/tasks/${taskId}`, form.value, {
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${token}`
                    }
                })
                console.log('Task updated successfully', response.data);
                router.push({name: 'taskDetails', params: {id: taskId}})


            } catch (error) {
                console.error('Error updating task', error);
                if (error.response && error.response.data.errors) {
                    errors.value = error.response.data.errors;
                }
            }
        }

        return { form, errors, updateTask }
    }
}
</script>

