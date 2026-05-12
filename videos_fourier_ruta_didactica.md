# Ruta didactica con videos Fourier

Fuentes:

- https://youtu.be/imMDHs7lNds - Serie Compleja de Fourier
- https://youtu.be/T0gLjmvWGMY - Integral de Fourier, explicacion completa
- https://youtu.be/bMAtkgveHlE - Transformada de Fourier, que es
- https://youtu.be/bDd3cLr88h0 - Transformada de Fourier usando definicion

## Integracion recomendada

### 1. Serie compleja de Fourier

Ubicacion: seccion 1, despues de presentar la forma trigonometrica.

Idea que aporta:

- Reescribe senos y cosenos como exponenciales complejas.
- Muestra que los coeficientes complejos contienen amplitud y fase.
- Prepara la notacion que despues se usa en la transformada de Fourier.

Formula eje:

```text
x(t) = sum_k c_k exp(j k omega0 t)
```

### 2. Integral de Fourier

Ubicacion: inicio de la seccion 3.

Idea que aporta:

- La serie de Fourier funciona naturalmente para senales periodicas.
- Para una senal no periodica se piensa en un periodo que crece sin limite.
- Las lineas espectrales se juntan hasta formar un continuo.

Formula eje:

```text
Delta omega = pi/L
```

### 3. Transformada de Fourier: significado

Ubicacion: inmediatamente despues de la definicion formal de transformada.

Idea que aporta:

- La transformada mide cuanto de cada exponencial compleja/frecuencia hay en la senal.
- Cambia el punto de vista: de tiempo a frecuencia.
- Es la herramienta que permite entender filtros, resonancia, vibracion y sistemas LTI.

Formula eje:

```text
X(omega) = integral x(t) exp(-j omega t) dt
```

### 4. Transformada por definicion

Ubicacion: despues de la tabla de pares comunes o como ejemplo guiado.

Idea que aporta:

- Para calcular una transformada se sustituye en la definicion.
- Si aparece valor absoluto, se parte la integral por intervalos.
- El ejemplo `exp(-|t|)` es pedagogicamente bueno porque produce una transformada real, par y tipo pasa-bajas.

Resultado eje:

```text
exp(-|t|) <-> 2/(1 + omega^2)
```

## Actividad sugerida

Pedir a los alumnos que conecten cada video con una pregunta:

1. Que gana la forma compleja frente a senos y cosenos?
2. Que significa que las lineas espectrales se vuelvan continuas?
3. Que mide realmente `X(omega)`?
4. Por que se parte la integral al transformar `exp(-|t|)`?

