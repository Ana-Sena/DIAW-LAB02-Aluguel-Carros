# Contribuindo

1. Crie uma branch para uma mudança coerente: `git switch -c feat/minha-mudanca`.
2. Atualize os modelos UML e as histórias quando mudar comportamento ou domínio.
3. Execute `mvn -f backend/pom.xml test` e `npm --prefix frontend run build`.
4. Formate a interface com `npm --prefix frontend run format`.
5. Faça commits incrementais: `feat:`, `fix:`, `test:`, `docs:`, `refactor:` ou `chore:`. Use escopo quando útil, por exemplo `fix(auth): invalida sessão ao excluir conta`.
6. Revise `git diff --staged` para não incluir credenciais ou arquivos gerados. Abra um PR descrevendo problema, alteração e validação.

Não edite commits publicados para simular histórico; registre as etapas reais do desenvolvimento. Dados das contas de demonstração são fictícios e só podem ser carregados no perfil demo.
