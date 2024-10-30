import { Routes } from '@angular/router';

export const routes: Routes = [
  
    {
        path: '',
        loadComponent: () =>
        import(
            './views/home/home.component'
        ).then((mod) => mod.HomeComponent),
    },
    
    {
        path: 'impressum',
        loadComponent: () =>
        import(
            './views/impressum/impressum.component'
        ).then((mod) => mod.ImpressumComponent),
        children: [
            // Showcase, kann also raus wenn ihr WebGLUniformLocation.
            { 
                path: 'error', 
                loadComponent: () =>
                    import(
                        '../lib/components/four-zero-four/four-zero-four.component'
                    ).then((mod) => mod.FourZeroFourComponent),
            
            }    
        ]
    },
    
    {
        path: '**',
        loadComponent: () =>
        import(
            '../lib/components/four-zero-four/four-zero-four.component'
        ).then((mod) => mod.FourZeroFourComponent),
  },
];
