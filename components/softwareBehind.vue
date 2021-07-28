<!-- eslint-disable -->
<template>
    <section class="py-128 bg-white" data-header-text="text-gray-dark">
        <div class="text-gray-dark container inner text-center">
            <h3 class="text-36 pb-44">The sigstore ecosystem</h3>
            <div class="flex justify-center items-start pb-64">
                <button v-animate-on-scroll 
                    v-for="(group, index) in groupTabs" 
                    :key="index" class="border-2 hover:bg-pastel-blue p-14 text-12 h leading-15 rounded-full mx-12 hover:border-pastel-blue duration-150"
                    :class="[group == activeGroup ? 'bg-pastel-blue border-pastel-blue' : 'bg-white border-black']"
                    @click="setActiveGroup(group)"
                >
                    {{group}}
                </button>
            </div>

            <div v-if="activeGroupData" class="w-full">
                <div class="flex justify-center items-start">
                    <div class="w-full md:w-1/3 text-left markdown" v-html="$md.render(activeGroupData.textOverview)"></div>
                    <div class="w-full md:w-2/3"><img :src="activeGroupData.groupDiagram" :alt="`${activeGroupData.groupName} architecture diagram`"></div>
                </div>
            </div>
        </div>
    </section>
</template>
<script lang="js">

export default {

    components: {

    },

    data: () => ({
        groups: {
            type: Array,
            default: null
        },
        activeGroup: 'Overview'
    }),

    computed: {
        groupTabs(){
            let groupTabList;
            if(this.groups.length){
                groupTabList = this.groups.map(g => g.groupName)
            }
            return groupTabList;
        },
        activeGroupData() {
            let group;
            if(this.groups.length){
                group = this.groups.reduce((groupData, g) => {
                    if (g.groupName === this.activeGroup) groupData = g;
                    return groupData;
                }, {}); 
            } 
            return group;
        }
    },

    created() {
        this.getStoryContent();
    },

    methods: {
        async getStoryContent(){
            const ecosystemData = await this.$content('groups').fetch()
            const t = ecosystemData.reduce((eco, g) => {
                if (g.slug === 'groups') eco = g;
                return eco;
            }, {});  
            this.groups = t.group; 
        },
        setActiveGroup(g) {
            this.activeGroup = g;
        }
    },

};
</script>
<!-- eslint-enable -->