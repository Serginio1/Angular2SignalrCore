import { Component } from '@angular/core';

@Component({
        selector: 'my-comp',
        template: `<p>Имя: {{name}}</p>
                <p>Возраст: {{age}}</p>`
})
export class MyComponent {
        name = "Сергей";
        age = 52;
}