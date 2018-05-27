const classifyCommand = require('../../speech/command_classify').classifyCommand;
const synonyms = require('../../speech/synonyms');
const speechCommand = require('../../speech/speech_command');
const expect = require('chai').expect;

describe('command_classify', () => {
  synonyms.lamp.map(lampCommand => {
    describe(`Given a LAMP command ${lampCommand}`, () => {
      synonyms.on.map(onCommand => {
        describe(`Given an ON command ${onCommand}`, () => {
          synonyms.all.map(allCommand => {
            describe(`Given an ALL command ${allCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${onCommand} ${allCommand}`);

              it('Should return LIGHTS_ON_ALL', () => {
                expect(result).to.equal(speechCommand.LIGHTS_ON_ALL);
              });
            });
          });

          synonyms.bedroom.map(bedroomCommand => {
            describe(`Given an BEDROOM command ${bedroomCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${onCommand} ${bedroomCommand}`);

              it('Should return LIGHTS_ON_BEDROOM', () => {
                expect(result).to.equal(speechCommand.LIGHTS_ON_BEDROOM);
              });
            });
          });

          synonyms.hallway.map(hallwayCommand => {
            describe(`Given an HALLWAY command ${hallwayCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${onCommand} ${hallwayCommand}`);

              it('Should return LIGHTS_ON_HALLWAY', () => {
                expect(result).to.equal(speechCommand.LIGHTS_ON_HALLWAY);
              });
            });
          });

          synonyms.wardrobe.map(wardrobeCommand => {
            describe(`Given an WARDROBE command ${wardrobeCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${onCommand} ${wardrobeCommand}`);

              it('Should return LIGHTS_ON_WARDROBE', () => {
                expect(result).to.equal(speechCommand.LIGHTS_ON_WARDROBE);
              });
            });
          });

          synonyms.livingRoom.map(livingRoomCommand => {
            describe(`Given an LIVING_ROOM command ${livingRoomCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${onCommand} ${livingRoomCommand}`);

              it('Should return LIGHTS_ON_LIVING_ROOM', () => {
                expect(result).to.equal(speechCommand.LIGHTS_ON_LIVING_ROOM);
              });
            });
          });

          describe(`Given an no location command`, () => {
            const result = classifyCommand(`${lampCommand} ${onCommand}`);

            it('Should return LIGHTS_ON', () => {
              expect(result).to.equal(speechCommand.LIGHTS_ON);
            });
          });
        });
      });

      synonyms.off.map(offCommand => {
        describe(`Given an OFF command ${offCommand}`, () => {
          synonyms.all.map(allCommand => {
            describe(`Given an ALL command ${allCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${offCommand} ${allCommand}`);

              it('Should return LIGHTS_OFF_ALL', () => {
                expect(result).to.equal(speechCommand.LIGHTS_OFF_ALL);
              });
            });
          });

          synonyms.bedroom.map(bedroomCommand => {
            describe(`Given an BEDROOM command ${bedroomCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${offCommand} ${bedroomCommand}`);

              it('Should return LIGHTS_OFF_BEDROOM', () => {
                expect(result).to.equal(speechCommand.LIGHTS_OFF_BEDROOM);
              });
            });
          });

          synonyms.hallway.map(hallwayCommand => {
            describe(`Given an HALLWAY command ${hallwayCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${offCommand} ${hallwayCommand}`);

              it('Should return LIGHTS_OFF_HALLWAY', () => {
                expect(result).to.equal(speechCommand.LIGHTS_OFF_HALLWAY);
              });
            });
          });

          synonyms.wardrobe.map(wardrobeCommand => {
            describe(`Given an WARDROBE command ${wardrobeCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${offCommand} ${wardrobeCommand}`);

              it('Should return LIGHTS_OFF_WARDROBE', () => {
                expect(result).to.equal(speechCommand.LIGHTS_OFF_WARDROBE);
              });
            });
          });

          synonyms.livingRoom.map(livingRoomCommand => {
            describe(`Given an LIVING_ROOM command ${livingRoomCommand}`, () => {
              const result = classifyCommand(`${lampCommand} ${offCommand} ${livingRoomCommand}`);

              it('Should return LIGHTS_OFF_LIVING_ROOM', () => {
                expect(result).to.equal(speechCommand.LIGHTS_OFF_LIVING_ROOM);
              });
            });
          });

          describe(`Given an no location command`, () => {
            const result = classifyCommand(`${lampCommand} ${offCommand}`);

            it('Should return LIGHTS_OFF', () => {
              expect(result).to.equal(speechCommand.LIGHTS_OFF);
            });
          });
        });
      });

      describe(`Given an unknown toggle command`, () => {
        const result = classifyCommand(`${lampCommand} unknown`);

        it('Should return unknown', () => {
          expect(result).to.equal(speechCommand.UNKNOWN);
        });
      });
    });
  });

  synonyms.forecasts.map(forecastsCommand => {
    describe(`Given a FORECASTS command ${forecastsCommand}`, () => {
      synonyms.show.map(showCommand => {
        describe(`Given an SHOW command ${showCommand}`, () => {
          const result = classifyCommand(`${forecastsCommand} ${showCommand}`);

          it('Should return SHOW_FORECASTS', () => {
            expect(result).to.equal(speechCommand.SHOW_FORECASTS);
          });
        });
      });

      synonyms.hide.map(hideCommand => {
        describe(`Given an HIDE command ${hideCommand}`, () => {
          const result = classifyCommand(`${forecastsCommand} ${hideCommand}`);

          it('Should return HIDE_FORECASTS', () => {
            expect(result).to.equal(speechCommand.HIDE_FORECASTS);
          });
        });
      });

      describe(`Given an UNKNOWN toggle command`, () => {
        const result = classifyCommand(`${forecastsCommand} unknown`);

        it('Should return unknown', () => {
          expect(result).to.equal(speechCommand.UNKNOWN);
        });
      });
    });
  });

  synonyms.news.map(newsCommand => {
    describe(`Given a NEWS command ${newsCommand}`, () => {
      synonyms.show.map(showCommand => {
        describe(`Given an SHOW command ${showCommand}`, () => {
          const result = classifyCommand(`${newsCommand} ${showCommand}`);

          it('Should return SHOW_NEWS', () => {
            expect(result).to.equal(speechCommand.SHOW_NEWS);
          });
        });
      });

      synonyms.hide.map(hideCommand => {
        describe(`Given an HIDE command ${hideCommand}`, () => {
          const result = classifyCommand(`${newsCommand} ${hideCommand}`);

          it('Should return HIDE_NEWS', () => {
            expect(result).to.equal(speechCommand.HIDE_NEWS);
          });
        });
      });

      synonyms.change.map(changeCommand => {
        describe(`Given an CHANGE command ${changeCommand}`, () => {
          const result = classifyCommand(`${newsCommand} ${changeCommand}`);

          it('Should return CHANGE_NEWS_SOURCE', () => {
            expect(result).to.equal(speechCommand.CHANGE_NEWS_SOURCE);
          });
        });
      });

      describe(`Given an UNKNOWN toggle command`, () => {
        const result = classifyCommand(`${newsCommand} unknown`);

        it('Should return unknown', () => {
          expect(result).to.equal(speechCommand.UNKNOWN);
        });
      });
    });
  });

  synonyms.article.map(articleCommand => {
    describe(`Given a ARTICLE command ${articleCommand}`, () => {
      synonyms.show.map(showCommand => {
        describe(`Given an SHOW command ${showCommand}`, () => {
          const result = classifyCommand(`${articleCommand} ${showCommand}`);

          it('Should return SHOW_ARTICLES', () => {
            expect(result).to.equal(speechCommand.SHOW_ARTICLES);
          });
        });
      });

      synonyms.hide.map(hideCommand => {
        describe(`Given an HIDE command ${hideCommand}`, () => {
          const result = classifyCommand(`${articleCommand} ${hideCommand}`);

          it('Should return HIDE_ARTICLES', () => {
            expect(result).to.equal(speechCommand.HIDE_ARTICLES);
          });
        });
      });

      synonyms.previous.map(previousCommand => {
        describe(`Given an PREVIOUS command ${previousCommand}`, () => {
          const result = classifyCommand(`${articleCommand} ${previousCommand}`);

          it('Should return PREVIOUS_ARTICLE', () => {
            expect(result).to.equal(speechCommand.PREVIOUS_ARTICLE);
          });
        });
      });

      synonyms.next.map(nextCommand => {
        describe(`Given an NEXT command ${nextCommand}`, () => {
          const result = classifyCommand(`${articleCommand} ${nextCommand}`);

          it('Should return NEXT_ARTICLE', () => {
            expect(result).to.equal(speechCommand.NEXT_ARTICLE);
          });
        });
      });

      describe(`Given an UNKNOWN toggle command`, () => {
        const result = classifyCommand(`${articleCommand} unknown`);

        it('Should return unknown', () => {
          expect(result).to.equal(speechCommand.UNKNOWN);
        });
      });
    });
  });

  synonyms.bus.map(busCommand => {
    describe(`Given a BUS command ${busCommand}`, () => {
      synonyms.when.map(whenCommand => {
        describe(`Given an WHEN command ${whenCommand}`, () => {
          const result = classifyCommand(`${busCommand} ${whenCommand}`);

          it('Should return NEXT_BUS', () => {
            expect(result).to.equal(speechCommand.NEXT_BUS);
          });
        });
      });

      describe(`Given an UNKNOWN toggle command`, () => {
        const result = classifyCommand(`${busCommand} unknown`);

        it('Should return unknown', () => {
          expect(result).to.equal(speechCommand.UNKNOWN);
        });
      });
    });
  });

  synonyms.train.map(trainCommand => {
    describe(`Given a TRAIN command ${trainCommand}`, () => {
      synonyms.when.map(whenCommand => {
        describe(`Given an WHEN command ${whenCommand}`, () => {
          const result = classifyCommand(`${trainCommand} ${whenCommand}`);

          it('Should return NEXT_TRAIN', () => {
            expect(result).to.equal(speechCommand.NEXT_TRAIN);
          });
        });
      });

      describe(`Given an UNKNOWN toggle command`, () => {
        const result = classifyCommand(`${trainCommand} unknown`);

        it('Should return unknown', () => {
          expect(result).to.equal(speechCommand.UNKNOWN);
        });
      });
    });
  });

  synonyms.remind.map(remindCommand => {
    describe(`Given a REMIND command ${remindCommand}`, () => {
      describe(`Given a valid remind command`, () => {
        const result = classifyCommand(`${remindCommand} om en minuter att do stuff`);

        it('Should return CREATE_REMINDER', () => {
          expect(result).to.equal(speechCommand.CREATE_REMINDER);
        });
      });

      describe(`Given an UNKNOWN remind command`, () => {
        const result = classifyCommand(`${remindCommand} unknown`);

        it('Should return unknown', () => {
          expect(result).to.equal(speechCommand.UNKNOWN);
        });
      });
    });
  });

  synonyms.turnOffMirror.map(turnOffMirrorCommand => {
    describe(`Given a TURN OFF MIRROR command ${turnOffMirrorCommand}`, () => {
      const result = classifyCommand(`${turnOffMirrorCommand}`);

      it('Should return TURN_OFF', () => {
        expect(result).to.equal(speechCommand.TURN_OFF);
      });
    });
  });

  synonyms.coffeMaker.map(coffeMakerCommand => {
    describe(`Given a COFFE MAKER command ${coffeMakerCommand}`, () => {
      const result = classifyCommand(`${coffeMakerCommand} 6.35`);

      it('Should return COFFE MAKER', () => {
        expect(result.command).to.equal(speechCommand.SET_COFFEMAKER_TIMER);
      });
    });
  });

  synonyms.all.map(allCommand => {
    describe(`Given a ALL command ${allCommand}`, () => {
      synonyms.off.map(offCommand => {
        describe(`Given an OFF command ${offCommand}`, () => {
          const result = classifyCommand(`${allCommand} ${offCommand}`);

          it('Should return TURN_OFF_EVERYTHING', () => {
            expect(result).to.equal(speechCommand.TURN_OFF_EVERYTHING);
          });
        });
      });

      describe(`Given an UNKNOWN toggle command`, () => {
        const result = classifyCommand(`${allCommand} unknown`);

        it('Should return unknown', () => {
          expect(result).to.equal(speechCommand.UNKNOWN);
        });
      });
    });
  });

  synonyms.all.map(allCommand => {
    describe(`Given a ALL command ${allCommand}`, () => {
      synonyms.on.map(onCommand => {
        describe(`Given an ON command ${onCommand}`, () => {
          const result = classifyCommand(`${allCommand} ${onCommand}`);

          it('Should return TURN_ON_EVERYTHING', () => {
            expect(result).to.equal(speechCommand.TURN_ON_EVERYTHING);
          });
        });
      });
    });
  });

  describe(`Given an unknown command`, () => {
    const result = classifyCommand(`unknown`);

    it('Should return UNKNOWN', () => {
      expect(result).to.equal(speechCommand.UNKNOWN);
    });
  });
});
