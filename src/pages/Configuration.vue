<template>
    <section id="configuration-page">
        <div class="row h-100">
            <div class="col-lg-6">
                <div class="d-flex justify-content-center h-100">
                    <div class="flex-grow-1 px-5 mx-5">
                        <div class="height-200p"></div>
                        <a href="https://unsplash.com" title="Unsplash Home " class="opacity-1">
                            <svg width="32" height="32" class="_1Jlgk" version="1.1" viewBox="0 0 32 32" aria-labelledby="unsplash-home" aria-hidden="false"><title id="unsplash-home">Unsplash Home</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg>
                        </a>
                        <div class="mt-5">
                            <header class="mb-5">
                                <h1 class="text-xlg font-weight-bold">Hi, there</h1>
                                <p class="text-gray-main text-md mt-3">
                                    Your photos statistics right on your chrome new tab :) 
                                </p>
                            </header>
                            <small v-if="errors.unknown" class="d-block text-red my-2">{{ errors.unknown }}</small>
                            <div>
                                <label class="text-gray-700" for="username">Username <span class="text-red">*</span></label>
                                <input type="text" id="username" v-model="username" class="form-control w-100 mt-2" placeholder="Your unsplash username">
                                <small v-if="errors.username" class="d-block text-red mt-2">{{ errors.username }}</small>
                            </div>
                            <div class="mt-4">
                                <div class="d-flex justify-content-between">
                                    <label class="text-gray-700" for="access_key">Access Key <span class="text-red">*</span></label>
                                    <a href="https://unsplash.com/documentation#registering-your-application" title="registering-your-application" class="text-xsm opacity-1"><small>How can I find my access key?</small></a>
                                </div>
                                <input type="text" id="access_key" v-model="access_key" class="form-control w-100 mt-2" placeholder="Your unsplash application access key">
                                <small v-if="errors.access_key" class="d-block text-red mt-2">{{ errors.access_key }}</small>
                            </div>
                            <div class="mt-4 d-flex justify-content-center">
                                <button class="btn btn-primary px-5" @click="validate">
                                    <v-loading v-if="isLoading" width="20px"></v-loading>
                                    <span v-else>Let's go</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-6 position-relative">
                <div class="position-absolute" style="bottom: 20px;right: 30px;">
                    <small class="text-xsm">Photo by <a href="https://unsplash.com/@nasimdadfar" class="text-white">@nasimdadfar</a></small>
                </div>
                <div class="side-image" style="background-image: url('https://images.unsplash.com/photo-1603532654387-fc0a4555e8ff?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&h=1080&q=80')"></div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    data() {
        return {
            errors: {
                username: null,
                access_key: null,
                unknown: null
            },
            username: '',
            access_key: '',
            isLoading: false
        }
    },

    methods: {
        validate() {
            this.errors = {
                unknown: null,
                username: null,
                access_key: null
            };

            if (!this.username) {
                this.errors.username = 'Username is required.';
            }

            if (!this.access_key) {
                this.errors.access_key = 'Access Key is required.';
            }

            if (this.username && this.access_key) {
                this.fetchUser()
            }
        },

        fetchUser() {
            this.isLoading = true

            this.axios
                .get(`https://api.unsplash.com/users/${this.username}/?client_id=${this.access_key}`)
                .then(this.onResponse)
                .catch(this.onError)
        },

        onResponse(response) {
            this.isLoading = false

            localStorage.setItem('un_ext_user_details', JSON.stringify(response.data))
            localStorage.setItem('un_ext_access_key', this.access_key)

            window.location.reload()
        },

        onError() {
            this.isLoading = false
            this.errors = {
                unknown: null,
                username: null,
                access_key: null,
            }

            this.errors.unknown = 'Error: Please check your username and access token.'
        }
    }
}
</script>
