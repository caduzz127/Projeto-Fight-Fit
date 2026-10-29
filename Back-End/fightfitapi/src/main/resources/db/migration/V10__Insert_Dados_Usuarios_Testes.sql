-- Usuarios de teste fixos. Senha em texto claro = nome_usuario (apenas DEV/TESTE).
INSERT INTO usuarios (id, nome_usuario, senha_usuario, cargo_usuario) VALUES
                                                                          ('2459afb3-721b-4d9c-9b76-c024f95f2c61', 'admin2', '$2a$10$mRrBK57dEbKKnOSJj8N1HO6s7FrwOb8CfcZw9bWub/tCHIxHnbKeO', 'SYSTEM_USER'),
                                                                          ('767305a7-cdce-4a50-9a7a-3daeaaa2be74', 'admin', '$2a$10$xIH3tEaUpGe5JgsCfMEH1esDW6IJ6UBiNce1f0hguPMfcZSnixx8e', 'SYSTEM_ADMIN'),
                                                                          ('b980eb8f-6353-47e2-b9bf-12e525e907ae', 'admin1', '$2a$10$WuFn3vh7C17qGRVtuvIjo.WMtIZDZOY5Ak6RNsnXmy.lanYQ6la7O', 'SYSTEM_USER')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO treinos (id, nome_treinos, id_usuarios) VALUES
                                                        ('45986051-a1e8-4477-b598-9ad50fa316d5', 'TREINO B', 'b980eb8f-6353-47e2-b9bf-12e525e907ae'),
                                                        ('bb02c65f-9430-42dc-8672-4d42c58c1431', 'TREINO A', '767305a7-cdce-4a50-9a7a-3daeaaa2be74'),
                                                        ('d6f7ad7e-7403-4bb4-81ef-de1e030f0b18', 'TREINO C', '2459afb3-721b-4d9c-9b76-c024f95f2c61')
    ON CONFLICT (id) DO NOTHING;

INSERT INTO exercicios_individuais (id, nome_exercicios_individuais, serie_exercicios_individuais, repeticoes_exercicios_individuais, carga_exercicios_individuais, id_treinos) VALUES
                                                                                                                                                                                    ('379c4ae1-b94a-4b92-aa19-b817b162398a', 'puxada alta na polia', 3, 8, 40, 'bb02c65f-9430-42dc-8672-4d42c58c1431'),
                                                                                                                                                                                    ('9636f8ea-93e4-44dd-ab9f-0af01fef191b', 'leg press', 3, 8, 200, 'd6f7ad7e-7403-4bb4-81ef-de1e030f0b18'),
                                                                                                                                                                                    ('b93849b3-0aa1-410e-9697-135e710ec2e7', 'Supino Inclinado com halter', 3, 8, 40, '45986051-a1e8-4477-b598-9ad50fa316d5')
    ON CONFLICT (id) DO NOTHING;
