export const generateCode = async (): Promise<string> => {
  const { default: Pet } = await import('../../database/models/pet.model');

  while (true) {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const existing = await Pet.findOne({ code });

    if (!existing) {
      return code;
    }
  }
};
