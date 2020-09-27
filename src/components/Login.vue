<template>
    <div id="login">
        <div id="login-container">
            <form class="u-full-width form" v-if="showLoginForm">
                <div class="twelve columns">
                    <label for="exampleEmailInput">Your email</label>
                    <input
                        class="u-full-width"
                        type="email"
                        placeholder="test@mailbox.com"
                        id="exampleEmailInput"
                        v-model="loginFields.email"
                    />
                </div>
                <div class="twelve columns">
                    <label for="exampleEmailInput">Your Password</label>
                    <input
                        class="u-full-width"
                        type="password"
                        placeholder="Your Password"
                        v-model="loginFields.password"
                        autocomplete="on"
                    />
                </div>
                <button
                    @click.prevent="login"
                    class="button-primary"
                    style="margin-left:10px;float:right;"
                    value="Login"
                >Login</button>
                <button
                    @click.prevent="showSignUpForm = true;showLoginForm = false "
                    class="button-secondary"
                    style="margin-left:10px;float:right;"
                    value="Login"
                >Signup</button>
            </form>
            <form class="u-full-width form" v-if="showSignUpForm">
                <div class="twelve columns">
                    <label for="exampleEmailInput">Full name</label>
                    <input
                        class="u-full-width"
                        type="text"
                        placeholder="Your Full name"
                        v-model="signUpFields.fullname"
                    />
                </div>
                <div class="twelve columns">
                    <label for="exampleEmailInput">Your email</label>
                    <input
                        class="u-full-width"
                        type="email"
                        placeholder="Your email"
                        v-model="signUpFields.email"
                    />
                </div>
                <div class="twelve columns">
                    <label for="exampleEmailInput">Your Password</label>
                    <input
                        class="u-full-width"
                        type="text"
                        placeholder="password"
                        v-model="signUpFields.password"
                    />
                </div>
                <input
                    @click.prevent="signUp"
                    class="button-primary"
                    type="submit"
                    style="margin-left:10px;float:right;"
                    value="Signup"
                />
                <button
                    @click="showSignUpForm = false;showLoginForm = true "
                    class="button-secondary"
                    style="margin-left:10px;float:right;"
                    value="Login"
                >Cancel</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "Login",
    data: () => ({
        showSignUpForm: false,
        showLoginForm: true,
        loginFields: {
            email: "",
            password: "",
        },
        signUpFields: {
            fullname: "",
            email: "",
            password: "",
        },
    }),
    methods: {
        async signUp() {
            try {
                const response = await fetch(
                    "http://192.168.1.121:5000/users/signup",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(this.signUpFields),
                    }
                );
                if (response.status === 200) {
                    this.showSignUpForm = false;
                    this.showLoginForm = true;
                }
                if (response.status == 403) this.emailInUse = true;
            } catch (err) {
                console.log(err);
            }
        },
        async login() {
            try {
                const response = await fetch(
                    "http://192.168.1.121:5000/users/signin",
                    {
                        method: "POST",
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(this.loginFields),
                    }
                );
                if (response.status == 200) {
                    const userData = await response.json();
                    localStorage.setItem("site_info", JSON.stringify(userData));
                    this.$router.push("/");
                } else {
                    console.log("WRONG LOGIN");
                }
            } catch (err) {
                console.log(err);
            }
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
#login {
    height: 100%;
    display: flex;
    background: #f8f8f8;
    #login-container {
        margin: auto;
        background: #fff;
        padding: 20px;
        width: 500px;
        display: flex;
        align-items: center;
        box-shadow: 0px 2px 5px #0000002e;
        form {
            margin: 0;
        }
    }
}
</style>
