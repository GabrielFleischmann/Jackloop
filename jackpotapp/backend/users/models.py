from django.db import models


class Users(models.Model):
    email = models.EmailField('Email', unique=True)
    senha = models.CharField('Senha', max_length=255)

    class Meta:
        verbose_name = 'Categoria'
        verbose_name_plural = 'Categorias'
        ordering = ['id']

    def __str__(self):
        return f'{self.id} - {self.email}'