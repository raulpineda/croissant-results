import React, { Component } from "react";

class Results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ratingsCount: 0,
      ratingsPerCroissant: {},
      showDrillDown: true
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      Object.keys(prevState.ratingsPerCroissant).length !==
        nextProps.croissants.length ||
      prevState.ratingsCount !== nextProps.ratings.length
    ) {
      const ratingsPerCroissant = nextProps.ratings.reduce((acc, rating) => {
        acc[rating.id]
          ? acc[rating.id].push(rating)
          : (acc[rating.id] = [rating]);
        return acc;
      }, {});

      const globalTotals = nextProps.ratings.reduce((acc, rating) => {
        if (rating.id && rating.id !== "undefined") {
          const cats = Object.keys(rating).filter(c => c !== "id");

          for (const cat of cats) {
            acc[cat] = acc[cat]
              ? Number(acc[cat]) + Number(rating[cat])
              : Number(rating[cat]);
          }
        }

        return acc;
      }, {});

      const globalAverages = Object.keys(globalTotals).reduce((acc, cat) => {
        acc[cat] = globalTotals[cat] / nextProps.ratings.length;
        return acc;
      }, {});

      const totalsPerCroissant = Object.keys(ratingsPerCroissant).reduce(
        (acc, croissantId) => {
          acc[croissantId] = ratingsPerCroissant[croissantId].reduce(
            (acc2, rating) => {
              if (rating.id && rating.id !== "undefined") {
                const cats = Object.keys(rating).filter(c => c !== "id");

                for (const cat of cats) {
                  acc2[cat] = acc2[cat]
                    ? Number(acc2[cat]) + Number(rating[cat])
                    : Number(rating[cat]);
                }
              }

              return acc2;
            },
            {}
          );

          return acc;
        },
        {}
      );

      const averagesPerCroissant = Object.keys(totalsPerCroissant).reduce(
        (acc, croissantId) => {
          acc[croissantId] = Object.keys(
            totalsPerCroissant[croissantId]
          ).reduce((acc2, cat) => {
            acc2[cat] =
              totalsPerCroissant[croissantId][cat] /
              ratingsPerCroissant[croissantId].length;
            return acc2;
          }, {});

          const croissant = nextProps.croissants.find(
            c => c.id === croissantId
          );
          if (croissant) {
            console.log(croissant.price - acc[croissantId].vfm);
            if (acc[croissantId].vfm >= croissant.price) {
              acc[croissantId].dtp = 10;
            } else {
              acc[croissantId].dtp = Math.max(
                10 - (croissant.price - acc[croissantId].vfm),
                0
              );
            }

            acc[croissantId].total = Object.keys(acc[croissantId])
              .filter(c => c !== "vfm" && c !== "id")
              .reduce((total, cat) => (total += acc[croissantId][cat]), 0);
          }

          return acc;
        },
        {}
      );

      return {
        ratingsCount: nextProps.ratings.length,
        ratingsPerCroissant: ratingsPerCroissant,
        globalTotals: globalTotals,
        globalAverages: globalAverages,
        totalsPerCroissant: totalsPerCroissant,
        averagesPerCroissant: averagesPerCroissant
      };
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.props.croissants
          .sort(
            (a, b) =>
              this.state.averagesPerCroissant[a.id].total >
              this.state.averagesPerCroissant[b.id].total
                ? -1
                : 1
          )
          .map(croissant => (
            <div>
              <h1>
                {croissant.index} - {croissant.bakery} ({this.state.averagesPerCroissant[
                  croissant.id
                ].total.toFixed(2)})
              </h1>
              {this.state.showDrillDown && (
                <div>
                  {Object.keys(this.state.averagesPerCroissant[croissant.id])
                    .filter(cat => !["vfm", "total"].includes(cat))
                    .map(cat => {
                      const label = cat === "dtp" ? "value-for-money" : cat;
                      const value = this.state.averagesPerCroissant[
                        croissant.id
                      ][cat];
                      return (
                        <div>
                          {label}: {value.toFixed(4)}
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          ))}
      </div>
    );
  }
}

export default Results;
