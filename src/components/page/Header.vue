<template>
  <header class="main-header">
        <nav class="d-flex px-4 align-items-center">
            <div class="d-flex align-items-center flex-grow-1">
                <a href="https://unsplash.com" title="Unsplash Home " class="opacity-1">
                    <svg width="32" height="32" class="_1Jlgk" version="1.1" viewBox="0 0 32 32" aria-labelledby="unsplash-home" aria-hidden="false"><title id="unsplash-home">Unsplash Home</title><path d="M10 9V0h12v9H10zm12 5h10v18H0V14h10v9h12v-9z"></path></svg>
                </a>
                <div class="flex-grow-1 ml-3">
                    <input type="text" class="form-control unsplash-search w-100" placeholder="Search free high-resolution photos">
                </div>
            </div>
            <div class="ml-3">
                <ul class="list d-flex align-items-center">
                    <li class="mr-4">
                        <a href="https://unsplash.com/?modal=%7B%22tag%22%3A%22Uploader%22%7D" title="Submit a photo" class="btn btn-submit">Submit a photo</a>
                    </li>
                    <li v-if="user && user.hasOwnProperty('profile_image')">
                        <a :href="`https://unsplash.com/@${user.username}`" class="user-avatar d-block opacity-1">
                            <img :src="user.profile_image.medium" :alt="user.username">
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
    </header>
</template>

<script>
export default {
    props: ['user']
}
</script>
