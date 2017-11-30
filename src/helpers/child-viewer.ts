export const childViewer: string = `<template>
  <!-- START CONTAINER FLUID -->
  <div class="container-fluid container-fixed-lg">
    <div class="row">
            <h3 class="page-title">\${heading}</h3>
    </div>
    <div class="row">
        <div class="col-md-12">
            <div class="panel panel-default">
             <ul class="nav nav-tabs nav-tabs-simple nav-tabs-primary " role="tablist" data-init-reponsive-tabs="collapse">
               <li repeat.for="row of router.navigation" class="\${row.isActive ? 'active' : ''}">
                  <a href.bind="row.href">
                   <span class="">\${row.title}</span>
                  </a>
               </li>
              </ul>
              <div class="tab-content">
                <router-view></router-view>
              </div>
            </div>
        </div>
    </div>
 
    <div class="inner">
    <!-- BEGIN PlACE PAGE CONTENT HERE -->
    

    <!-- END PLACE PAGE CONTENT HERE -->
  </div>
  <!-- END CONTAINER FLUID -->
  </div>
  <!-- END PAGE CONTENT -->
</template>
`