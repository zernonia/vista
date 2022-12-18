<br />
<p align="center">
  <a href="https://github.com/zernonia/vista">
    <img src="public/logo.svg" alt="Vista's Logo" width="80">
  </a>
  <br />

  <p align="center">
    Automatic, Animated subtitle generation for<br> short-form video! 
  </p>

  <p align="center"> 
    <a href="https://www.vistaeditor.com/">View Demo</a>
    ·
    <a href="https://github.com/zernonia/vista/issues">Report Bug</a>
    ·
    <a href="https://github.com/zernonia/vista/issues">Request Feature</a>
  </p>
</p>

<br/>

![vista - automatic, animated subtitle generation for short-form video](public/hero.png)

## Introduction

Vista is...

## 🚀 Features

- 🤩 Free
- 📖 Open-Source

### 🔨 Built With

- [Nuxt 3](https://v3.nuxtjs.org/)
- [Supabase](https://supabase.com)
- [UnoCss](https://uno.antfu.me/)
- [Vercel - Hosting & Domain](https://vercel.com)
- [AssemblyAI](https://www.assemblyai.com/)

## 🌎 Setup

### Prerequisites

Yarn

- ```sh
  npm install --global yarn
  ```

### Development

1. Clone the repo
   ```sh
   git clone https://github.com/zernonia/vista.git
   ```
2. Install NPM packages
   ```sh
   cd vista
   yarn install
   ```
3. Run local development instance
   ```sh
   yarn dev
   ```

### Supabase Database

```sql
create table users (
  id uuid default uuid_generate_v4() primary key,
  updated_at timestamp default now(),
  username text,
  full_name text,
  avatar_url text
);

create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references users (id),
  created_at timestamp default now(),
  video_key text,
  transcription_id text,
  words ARRAY,
  title text,
  config json
);


create or replace function public.handle_new_user()
  returns trigger as $$
  begin
    insert into public.users (id, avatar_url, username)
    values (new.id, new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'user_name';
    return new;
  end;
  $$ language plpgsql security definer;


create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## ➕ Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Acknowledgement

1. [Nuxt 3 - Awesome framework](https://v3.nuxtjs.org/)
1. [Supabase - Super easy setup (as always)](https://supabase.com)
1. [Tiptap - Awesome editor](https://tiptap.dev/)
1. [Vercel's Platform Starter Kit - Subdomain/Custom domain](https://github.com/vercel/platforms)
1. [Vercel's new og generation](https://github.com/vercel/satori)

## Author

- Zernonia ([@zernonia](https://twitter.com/zernonia))

Also, if you like my work, please buy me a coffee ☕😳

<a href="https://www.buymeacoffee.com/zernonia" target="_blank">
    <img src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" alt="Logo" >
  </a>

## 🔥 Contributors

<a href="https://github.com/zernonia/vista/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=zernonia/vista" />
</a>

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
