import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { invoke } from "@tauri-apps/api/tauri";
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})



export class AppComponent {
  greetingMessage = "";

  // Almacena el tiempo en milisegundos;
  private timeMs : number = 0;

  private subscription: Subscription;

  private mostrarContador: boolean  = false ; 
  public tiempo :string = "00:00";

  constructor() {
    this.subscription = interval(1000).subscribe(() => {
      this.actualizaPomodoro();
    });
  }


  obtenerTiempoFormateado(segundos: number): string {
    return `${String(Math.floor(segundos / 60)).padStart(2, '0')}:${String(segundos % 60).padStart(2, '0')}`;
  }

  public pausarContador():void{
    if( this.timeMs>0)
      this.mostrarContador = !this.mostrarContador;
  }

  public actualizaPomodoro():void{

    if( this.mostrarContador )
    {
      if( this.timeMs > 0 )
      {
        this.tiempo = this.obtenerTiempoFormateado ( this.timeMs) ;
        this.timeMs -- ; 
        if( this.timeMs == 0 )
        { 
          const sonido = new Audio('https://themushroomkingdom.net/sounds/wav/smb/smb_world_clear.wav');
          sonido.play();
          //this.tiempo = "00:00";
        }
      }
    }
  }
  

  public iniciaPomodoro( tiempo : number):void {
    this.mostrarContador = true;
    this.timeMs = 3;// tiempo * 60 ;
  }
  greet(event: SubmitEvent, name: string): void {
    event.preventDefault();

    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    invoke<string>("greet", { name }).then((text) => {
      this.greetingMessage = text;
    });
  }
}
