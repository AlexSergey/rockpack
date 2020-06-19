import { LocalizationServiceInterface } from './service';

export const mockLocalizationService = (): LocalizationServiceInterface => ({
  fetchLocalization: () => Promise.resolve({
    domain: 'messages',
    locale_data: {
      messages: {
        '': {
          domain: 'messages',
          plural_forms: 'nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);',
          lang: 'ru'
        },
        'Sign In': ['Вход'],
        'E-mail': ['Почта'],
        'Please input your e-mail!': ['Пожалуйста, введите свой e-mail!'],
        Password: ['Пароль'],
        'Please input your password!': ['Пожалуйста, введите свой пароль!'],
        'Sign Up': ['Регистрация'],
        'Sign Out': ['Выйти'],
        'Create post': ['Создать пост'],
        Create: ['Создать'],
        Title: ['Заголовок'],
        Comments: ['Комментарии'],
        Posts: ['Посты'],
        Users: ['Юзеры'],
        'Something went wrong. Try later, please.': ['Что-то пошло не так. Пожалуйста, попробуйте позже!'],
        'Posts page. Here you find the most popular posts on the Internet': ['Страница постов. Здесь вы найдете популярнейшие посты в Интернете'],
        'This post has %d comment': ['У этого поста %d комментарий', 'У этого поста %d комментариев', 'У этого поста %d комментариев'],
        'Update post': ['Обновить пост'],
        'Add comment': ['Добавить комментарий'],
        Publish: ['Опубликовать'],
        'Users list': ['Список юзеров'],
        'Post\u0004Update post %s': ['Обновить пост %s']
      }
    }
  })
});
