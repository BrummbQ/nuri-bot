<template>
  <section class="w-full py-12">
    <div
      class="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]"
    >
      <div class="flex flex-col justify-center space-y-4">
        <div class="space-y-2">
          <h1
            class="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
          >
            Mühelose Essensplanung mit dem Nuri Rezeptplaner
          </h1>
          <p class="max-w-[600px] text-muted-foreground md:text-xl">
            Mit unserem intuitiven Rezeptplaner musst du beim Kochen nicht mehr
            rätseln. Entdecke neue Rezepte, erstelle Speisepläne und generiere
            Einkaufslisten – alles an einem Ort.
          </p>
        </div>
        <div class="flex flex-col gap-2 min-[400px]:flex-row">
          <UiLink to="/basket/new/recipe">Rezepte suchen</UiLink>
        </div>
      </div>
      <img
        src="/assets/placeholder.svg"
        width="550"
        height="550"
        alt="Hero"
        class="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
      />
    </div>
  </section>

  <section class="w-full py-12 md:py-24 lg:py-32 bg-muted">
    <div
      class="flex flex-col items-center justify-center space-y-4 text-center"
    >
      <h2 class="text-3xl font-bold tracking-tighter sm:text-5xl">
        So verwendest du den Rezeptplaner
      </h2>
      <p
        class="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"
      >
        Unsere Schritt-für-Schritt-Anleitung zeigt, wie du unseren Rezeptplaner
        optimal nutzen und den Stress bei der Essensplanung vermeiden kannst.
      </p>
    </div>
    <div
      class="grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12"
    >
      <div class="flex flex-col justify-center space-y-4">
        <ol class="grid gap-6">
          <li>
            <h3 class="text-xl font-bold mb-1">Neue Rezepte entdecken</h3>
            <p class="text-muted-foreground">
              Finde und probiere neue Rezepte durch unsere Rezeptdatenbank
            </p>
          </li>
          <li>
            <h3 class="text-xl font-bold mb-1">Warenkorb erstellen</h3>
            <p class="text-muted-foreground">
              Die Zutaten werden zusammengefasst und in einem Warenkorb
              gesammelt
            </p>
          </li>
          <li>
            <h3 class="text-xl font-bold mb-1">Zutaten bestellen</h3>
            <p class="text-muted-foreground">
              Mit der Rewe Anbindung werden alle verfügbaren Zutaten in deinem
              nächsten Rewe Markt bestellt und du kannst sie abholen
            </p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
