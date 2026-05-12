# Notas del video jVYs-GTqm5U

Fuente: https://youtu.be/jVYs-GTqm5U

## Idea central

El video explica el paso conceptual de la serie de Fourier a la transformada de Fourier. Parte de una funcion periodica definida en el intervalo `[-L,L]`, escrita como suma de exponenciales complejas, y luego analiza que ocurre cuando el periodo crece sin limite.

## Puntos para clase

1. Serie de Fourier compleja:

   Una funcion periodica de periodo `2L` puede escribirse como

   ```text
   f(x) = sum_k c_k exp(i k pi x / L)
   ```

   donde las frecuencias discretas son

   ```text
   omega_k = k pi / L
   ```

2. Los coeficientes `c_k` se obtienen por proyeccion sobre las bases ortogonales `exp(i k pi x/L)`.

3. Si `L` aumenta, el periodo `2L` aumenta y la separacion entre frecuencias disminuye:

   ```text
   Delta omega = pi / L
   ```

4. En el limite `L -> infinito`, las frecuencias discretas se vuelven densas y la suma sobre `k` se convierte en una integral sobre `omega`.

5. Esa integral es la transformada de Fourier:

   ```text
   F(omega) = integral f(x) exp(-i omega x) dx
   ```

   y la reconstruccion se vuelve:

   ```text
   f(x) = (1/2pi) integral F(omega) exp(i omega x) d omega
   ```

6. Interpretacion importante para estudiantes:

   La serie de Fourier representa senales periodicas mediante lineas espectrales discretas. La transformada de Fourier representa senales no periodicas mediante un espectro continuo.

## Donde integrarlo en la pagina

Ubicacion recomendada: entre la seccion 2, "Serie de Fourier en tiempo discreto y propiedades", y la seccion 3, "Integral de Fourier".

Funcion pedagogica:

- Cerrar la idea de espectro discreto.
- Mostrar que al hacer crecer el periodo, las lineas de frecuencia se juntan.
- Preparar la entrada natural a la transformada de Fourier como limite de la serie.

## Actividad breve

Pregunta para los alumnos:

> Si el periodo de una senal periodica aumenta, que pasa con la separacion entre sus lineas espectrales?

Respuesta esperada:

> Disminuye. Como `Delta omega = pi/L`, cuando `L` crece, las frecuencias se acercan. En el limite, forman un continuo.

